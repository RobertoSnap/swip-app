
export interface Organization {
    "@type": string;
    name: string;
    sameas: string;
}

export interface MonetaryAmount {
    "@type": string;
    value: number;
    currency: string;
}

export interface Person {
    "@type": string;
    givenname: string;
    familyname: string;
    email: string;
    nationality: Country;
    identifier: PropertyValue;
    gender: string;
    birthdate: string;
}

export interface Country {
    "@type": string;
    name: string;
}

export interface PropertyValue {
    "@type": string;
    propertyid: string;
    value: string;
}

export interface Passport {
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