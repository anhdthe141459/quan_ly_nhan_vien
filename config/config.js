module.exports= {
    //service version
    version: "v1",
    //service port
    port: 8383,

    //url to asset database
    connectionString: process.env.DATABASE_URL,


    //redis configuration
    redis_host: 'localhost',
}