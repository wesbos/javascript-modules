const fullNames = ['Drew Minns', 'Heather Payne', 'Kristen Spencer', 'Wes Bos', 'Ryan Christiani'];

const firstNames = fullNames.map(name => name.split(' ').shift())

export default firstNames;
