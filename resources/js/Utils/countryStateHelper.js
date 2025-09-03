import { Country, State } from "country-state-city";

export function getCountryFlagUrl(code) {
    if (!code) return "";
    return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;
}

export function getCountryName(code) {
    if (!code) return "-";
    const country = Country.getCountryByCode(code);
    return country ? country.name : code;
}

export function getStateName(countryCode, stateCode) {
    if (!countryCode || !stateCode) return "-";
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode;
}