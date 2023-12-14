import validateInput from '../utils/validateInput';
import axios from 'axios';
import config from '../Config';

const CustomerStatus = {
  Hit: "Hit",
  Clear: "Clear"
}

const CheckSDNEndpoint = {
  respond: async function (request) {
    try {
      const { fullname, birthYear, country } = request.getBody();
      const response = await this.queryAPI(fullname, birthYear, country);
      const result = this.getMatches(response, fullname, birthYear, country);
      request.respondJSON(JSON.stringify({ result }));
    } catch (error) {
      console.error('Error in CheckSDNEndpoint:', error);
      request.respondJSON(JSON.stringify({ error: 'Internal Server Error' }), 500);
    }
  },

  queryAPI: async function (fullname, country) {
    const requests = {
      name: fullname,
      address: {
        country
      }
    };
    return axios.post(config.OFAC_API_URL, {
      apiKey: config.OFAC_API_KEY,
      minScore: 95,
      source: ["SDN"],
      cases: [requests]
    });
  },

  getMatches: function (response, fullname, birthYear, country) {
    if (!response.data || !response.data.matches || !response.data.matches[fullname]) {
      return [];
    }

    const matches = response.data.matches[fullname];
    return this.getHits(matches, fullname, birthYear, country);
  },

  getHits: function (matches, fullname, birthYear, country) {
    if (matches.length === 0) {
      return { customerStatus: CustomerStatus.Clear, parameters: [] };
    }
    else {
      let parameters = [];

      const nameHit = matches.some(match => this.nameMatches(fullname, match));
      const dobHit = matches.some(match => this.dobMatches(birthYear, match.dob));
      const countryHit = matches.some(match => this.countryMatches(country, match.addresses));

      parameters.push({ columnName: "Name", isHit: nameHit });
      parameters.push({ columnName: "Dob", isHit: dobHit });
      parameters.push({ columnName: "Country", isHit: countryHit });

      return { customerStatus: CustomerStatus.Hit, parameters };
    }
  },

  nameMatches: function (name, match) {
    // return name === match.firstName || name === match.lastName || name === match.fullName;
    return true;
  },

  dobMatches: function (birthYear, dob) {
    return new Date(dob).getFullYear() === Number(birthYear);
  },

  countryMatches: function (country, addresses) {
    return addresses.some(address => address.country === country);
  }
};

module.exports = CheckSDNEndpoint;
