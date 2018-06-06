import { default as root } from "./root";
import { default as tenant } from "./m365-tenant";

export default Promise.all([
    root,
    tenant,
]);
