
interface Organization {
    "@type": string;
    name: string;
    sameas: string;
}

interface MonetaryAmount {
    "@type": string;
    value: number;
    currency: string;
}

interface Person {
    "@type": string;
    givenname: string;
    familyname: string;
    email: string;
    nationality: Country;
    identifier: PropertyValue;
    gender: string;
    birthdate: string;
}

interface Country {
    "@type": string;
    name: string;
}

interface PropertyValue {
    "@type": string;
    propertyid: string;
    value: string;
}

interface Passport {
    dateofissue: string;
    dateofexpiry: string;
    issuer: string;
}

export interface EmploymentOffer {
    hiringorganization: Organization;
    basesalary: MonetaryAmount;
    jobstartdate: string;
    jobenddate: string;
    fte: number;
    candidate: Person;
    countryofresidence: Country;
    passport: Passport;
    candidatehasrequiredqualifications: boolean;
    infocheckedandcorrect: boolean;
}

export interface EmploymentOfferPayload {
    employmentoffer: EmploymentOffer;
}