import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmploymentOffer } from '../utils/credential-types/EmploymentOffer';

export default function EmploymentOfferCard({ data }: { data: EmploymentOffer }) {
    const {
        hiringorganization,
        basesalary,
        jobstartdate,
        jobenddate,
        fte,
        candidate,
        countryofresidence,
        passport,
        candidatehasrequiredqualifications,
        infocheckedandcorrect,
    } = data;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Job Information</Text>
            <Text>Hiring Organization: {hiringorganization.name}</Text>
            <Text>Salary: {basesalary.value} {basesalary.currency}</Text>
            <Text>Job Start Date: {jobstartdate}</Text>
            <Text>Job End Date: {jobenddate}</Text>
            <Text>FTE: {fte}</Text>

            <Text style={styles.title}>Candidate Information</Text>
            <Text>Name: {candidate.givenname} {candidate.familyname}</Text>
            <Text>Email: {candidate.email}</Text>
            <Text>Nationality: {candidate.nationality.name}</Text>
            <Text>Passport Number: {candidate.identifier.value}</Text>
            <Text>Gender: {candidate.gender}</Text>
            <Text>Birthdate: {candidate.birthdate}</Text>

            <Text style={styles.title}>Other Information</Text>
            <Text>Country of Residence: {countryofresidence.name}</Text>
            <Text>Passport Issuer: {passport.issuer}</Text>
            <Text>Passport Issue Date: {passport.dateofissue}</Text>
            <Text>Passport Expiry Date: {passport.dateofexpiry}</Text>
            <Text>Candidate Has Required Qualifications: {candidatehasrequiredqualifications ? 'Yes' : 'No'}</Text>
            <Text>Information Checked and Correct: {infocheckedandcorrect ? 'Yes' : 'No'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
});
