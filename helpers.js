const fs = require("fs");
const mongodb = require("mongodb");
require("dotenv").config();
const { MongoClient, Binary, ClientEncryption } = mongodb;
const mongoose = require("mongoose");

module.exports = {
  readMasterKey: function (path = "./master-key.txt") {
    return fs.readFileSync(path, "utf8").trim();
  },
  CsfleHelper: class {
    constructor({
      kmsProviders = null,
      keyAltNames = "demo-data-key",
      keyDB = "encryption",
      keyColl = "__keyVault",
      schema = null,
      connectionString = process.env.DATABASE_URL,
      mongocryptdBypassSpawn = false,
      mongocryptdSpawnPath = "mongocryptd",
    } = {}) {
      if (kmsProviders === null) {
        throw new Error("kmsProviders is required");
      }
      this.kmsProviders = kmsProviders;
      this.keyAltNames = keyAltNames;
      this.keyDB = keyDB;
      this.keyColl = keyColl;
      this.keyVaultNamespace = `${keyDB}.${keyColl}`;
      this.schema = schema;
      this.connectionString = connectionString;
      this.mongocryptdBypassSpawn = mongocryptdBypassSpawn;
      this.mongocryptdSpawnPath = mongocryptdSpawnPath;
      this.regularClient = null;
      this.csfleClient = null;
    }

    /**
     * Creates a unique, partial index in the key vault collection
     * on the ``keyAltNames`` field.
     *
     * @param {MongoClient} client
     */
    async ensureUniqueIndexOnKeyVault(client) {
      try {
        await client
          .db(this.keyDB)
          .collection(this.keyColl)
          .createIndex("keyAltNames", {
            unique: true,
            partialFilterExpression: {
              keyAltNames: {
                $exists: true,
              },
            },
          });
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }

    /**
     * In the guide, https://docs.mongodb.com/ecosystem/use-cases/client-side-field-level-encryption-guide/,
     * we create the data key and then show that it is created by
     * retreiving it using a findOne query. Here, in implementation, we only
     * create the key if it doesn't already exist, ensuring we only have one
     * local data key.
     *
     * @param {MongoClient} client
     */
    async findOrCreateDataKey(client) {
      const encryption = new ClientEncryption(client, {
        keyVaultNamespace: this.keyVaultNamespace,
        kmsProviders: this.kmsProviders,
      });

      await this.ensureUniqueIndexOnKeyVault(client);

      let dataKey = await client
        .db(this.keyDB)
        .collection(this.keyColl)
        .findOne({ keyAltNames: { $in: [this.keyAltNames] } });
      console.log("text====", dataKey);
      if (dataKey === null) {
        dataKey = await encryption.createDataKey("local", {
          keyAltNames: [this.keyAltNames],
        });
        return dataKey.toString("base64");
      }

      return dataKey["_id"].toString("base64");
    }

    async getRegularClient() {
      const client = new MongoClient(this.connectionString, {});
      return await client.connect();
    }

    async getCsfleEnabledConnection(schemaMap = null) {
      // Đảm bảo rằng schemaMap được cung cấp
      if (!schemaMap) {
        throw new Error(
          "schemaMap là tham số bắt buộc. Hãy xây dựng nó bằng phương thức CsfleHelper.createJsonSchemaMap."
        );
      }

      // Đảm bảo rằng kmsProviders và keyVaultNamespace đã được định nghĩa
      if (!this.kmsProviders || !this.keyVaultNamespace) {
        throw new Error(
          "KMS providers và keyVaultNamespace phải được định nghĩa."
        );
      }

      try {
        const extraOptions = {
          mongocryptdSpawnArgs: ["--idleShutdownTimeoutSecs", "75"],
        };

        // Tạo autoEncryptionOptions
        const autoEncryptionOptions = {
          keyVaultNamespace: this.keyVaultNamespace,
          kmsProviders: this.kmsProviders,
          schemaMap,
          mongocryptdSpawnArgs: ["--port", "30000"],
          mongocryptdURI: "mongodb://localhost:30000",
          extraOptions: extraOptions,
        };

        // Kết nối tới MongoDB với Mongoose và CSFLE
        await mongoose.connect(process.env.DATABASE_URL, {
          autoEncryption: autoEncryptionOptions,
        });

        console.log("Đã kết nối thành công tới MongoDB với CSFLE được bật.");
      } catch (error) {
        console.error("Lỗi khi kết nối tới MongoDB với CSFLE:", error.message);
        throw error; // Ném lại lỗi hoặc xử lý theo nhu cầu
      }
    }

    createCsfleSchemaMaps(dataKey = null) {
      if (dataKey === null) {
        throw new Error(
          "dataKey is a required argument. Ensure you've defined it in clients.js"
        );
      }
      return {
        "quan_ly_nhan_vien.nhan_viens": {
          bsonType: "object",
          encryptMetadata: {
            keyId: [new Binary(Buffer.from(dataKey, "base64"), 4)],
          },
          properties: {
            ten_nhan_su: {
              encrypt: {
                bsonType: "string",
                algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
              },
            },
          },
        },
        "quan_ly_nhan_vien.bang_luongs": {
          bsonType: "object",
          encryptMetadata: {
            keyId: [new Binary(Buffer.from(dataKey, "base64"), 4)],
          },
          properties: {
            tien_luong: {
              encrypt: {
                bsonType: "int",
                algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
              },
            },
          },
        },
      };
    }
  },
};
