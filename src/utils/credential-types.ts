import { EmploymentOfferPayload } from "./credential-types/EmploymentOffer";
import { JWTDecoded, JWTPayload } from 'did-jwt/lib/JWT';



// The JWTDecoded with the ExtendedPayload
export interface JWTDecodedWithCredentialType extends Omit<JWTDecoded, 'payload'> {
    payload: EmploymentOfferPayload & JWTPayload;
}
