const { parentPort, workerData } = require('worker_threads');
const { faker } = require('@faker-js/faker');

// States and cities used for realistic address generation
const nigerianStates = ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Ibadan'];
const stateCities = {
  Lagos: ['Ikeja', 'Yaba', 'Surulere', 'Lekki'],
  Ogun: ['Abeokuta', 'Ijebu Ode', 'Sango Ota'],
  Oyo: ['Ibadan', 'Ogbomosho'],
  Osun: ['Osogbo', 'Ife'],
  Ondo: ['Akure', 'Ondo Town'],
  Ekiti: ['Ado-Ekiti', 'Ikere'],
  Ibadan: ['Bodija', 'Dugbe', 'Challenge']
};

const professions = ['Student', 'Veterinarian', 'Farmer', 'Poultry Farmer', 'Extension Officer'];
const genders = ['male', 'female'];

const initialUsers = [
  ['fikayo3000@gmail.com', 'Akinlolu Fikayomi'],
  ['y2ffarms@gmail.com', 'Akintola Obaloluwa'],
  ['aduragbemi.ajayi@yahoo.com', 'Ajayi Aduragbemi'],
  ['ayodeleumejei1010@gmail.com', 'Ayodele Umejei'],
  ['waziriabubakar25@gmail.com', 'Abubakar Muhammad Waziri'],
  ['felixbiola@gmail.com', 'Olufemi Felix Biola'],
  ['rotxonline@gmail.com', 'Olurotimi Ogungbaigbe'],
  ['unik1700@gmail.com', 'Damilola Adenusi'],
  ['alert.mans@gmail.com', 'Mansur Basheer'],
  ['nomsanora@gmail.com', 'Thamar Ndimande'],
  ['dikatechonline@gmail.com', 'Adebari Ibrahim'],
  ['dikatechonline@gmail.com', 'Adebari Ibrahim'],
  ['ajideolayemi43@gmail.com', 'Olayemi Ajide'],
  ['omojodaluba74@gmail.com', 'Daluba Omojo'],
  ['tolulopegrace993@gmail.com', 'Tolulope Grace Ogundipe'],
  ['judithmoses2562@gmail.com', 'Judith Luckson'],
  ['fabiyimoses@gmail.com', 'Fabiyi Opeyemi Moses'],
];

function normalizePhone() {
  const prefix = faker.helpers.arrayElement(['80', '81', '90', '91']);
  const number = faker.string.numeric(8);
  return `+234${prefix}${number}`;
}

function generateAddress(state) {
  const cities = stateCities[state] || ['Ikeja'];
  const city = faker.helpers.arrayElement(cities);
  const street = faker.helpers.arrayElement(['Obafemi Awolowo Rd', 'Herbert Macaulay Way', 'Ogunlana Dr']);
  const houseNumber = faker.number.int({ min: 1, max: 200 });
  return `${houseNumber} ${street}, ${city}, ${state}`;
}

function generateUser(index, activeLimit) {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const fullName = `${first} ${last}`;
  const email = faker.internet.email({ firstName: first, lastName: last }).toLowerCase();
  const phone = normalizePhone();
  const state = faker.helpers.arrayElement(nigerianStates);
  const address = generateAddress(state);
  const profession = faker.helpers.arrayElement(professions);
  const gender = faker.helpers.arrayElement(genders);
  const status = index < activeLimit ? 'active' : 'inactive';

  return {
    _index: index,
    email,
    full_name: fullName,
    phone,
    address,
    state,
    profession,
    gender,
    status,
    role: 'user',
  };
}

// Worker input
const { startIndex, count, activeLimit } = workerData;

const users = [];
let globalIndex = startIndex;

// Inject predefined users first
for (let [email, full_name] of initialUsers) {
  const state = faker.helpers.arrayElement(nigerianStates);
  const phone = normalizePhone();
  const address = generateAddress(state);
  const profession = faker.helpers.arrayElement(professions);
  const gender = faker.helpers.arrayElement(genders);
  const status = users.length < activeLimit ? 'active' : 'inactive';

  users.push({
    _index: globalIndex++,
    email,
    full_name,
    phone,
    address,
    state,
    profession,
    gender,
    status,
    role: 'user',
  });
}

// Adjust how many new users to generate after injection
const remaining = count - users.length;

for (let i = 0; i < remaining; i++) {
  const user = generateUser(globalIndex, activeLimit);
  users.push(user);
  globalIndex++;
}

parentPort.postMessage(users);
