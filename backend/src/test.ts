import {test} from "./utils/DateUtils";
import {runJwtTest} from "./security/Jwt";
import {encodeObjectToBase64,decodeObjectFromBase64} from "./security/SecurityUtils";
// runJwtTest();
// test()
function t(){
    const obj = {a:1, b: 3}
    const base64 = encodeObjectToBase64(obj);
    const res = decodeObjectFromBase64(base64);

}

t()