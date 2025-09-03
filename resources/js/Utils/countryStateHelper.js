import { Country, State } from "country-state-city";

export default function getCountryFlagUrl = (code) => {
    if (!code) return "";
    // Gunakan kode negara lowercase, contoh: id, us, gb
    return `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;
};

export default function getCountryName = (code) => {
    if (!code) return "-";
    const country = Country.getCountryByCode(code);
    return country ? country.name : code;
};

export default function getStateName = (countryCode, stateCode) => {
    if (!countryCode || !stateCode) return "-";
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state ? state.name : stateCode;
};