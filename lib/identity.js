"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdentity = void 0;
const crypto_1 = require("crypto");
const utils_1 = require("dids/lib/utils");
/**
 * createIdentity generates a 32 byte seed and returns it as a
 * base64 encoded string which can be accepted as an argument to this CLI.
 */
function createIdentity() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('creating identity');
        const seed = (0, crypto_1.randomBytes)(32);
        return (0, utils_1.encodeBase64)(seed);
    });
}
exports.createIdentity = createIdentity;
