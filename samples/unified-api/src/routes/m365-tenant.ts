import { Log, LogLevel } from "../logging";
import { default as mockTenantData } from "../mockdata/tenant";
import { usingServer } from "../server";

export interface ITenant {
    name: string;
}

function getAllTenants(): Promise<ITenant[]> {

    return Promise.resolve(mockTenantData);
}

const promise = usingServer(server => {

    Log.write("Adding tenant routes", LogLevel.Verbose);

    server.get("/tenants", (req, res, next) => {

        getAllTenants().then(tenants => res.send(tenants));
        next();
    });

    return Promise.resolve();
});

export default promise;
