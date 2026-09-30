exports.lambdaHandler = async (event, context) => {
    try {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "success",
                message: "LumiLore Agentic Core is online.",
                timestamp: new Date().toISOString()
            })
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error",
            })
        };
    }
};
