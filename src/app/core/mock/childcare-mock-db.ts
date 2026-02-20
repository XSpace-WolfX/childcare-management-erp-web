import { Family } from '../models/family-model';
import { Child } from '../models/child-model';
import { AuthorizedPerson, AuthorizedPersonChildLink } from '../models/authorized-person-model';

export interface ChildcareMockDatabase {
  families: Family[];
  authorizedPersons: AuthorizedPerson[];
  authorizedPersonChildLinks: AuthorizedPersonChildLink[];
}

const mockDatabase: ChildcareMockDatabase = {
  families: [
    {
      id: '1',
      familyName: 'Famille Dupont',
      guardianNames: ['Marie Dupont', 'Jean Dupont'],
      address: '12 Rue de la Paix, 75001 Paris',
      phoneNumber: '+33 1 23 45 67 89',
      email: 'dupont.famille@example.fr',
      children: [
        {
          id: 'child-1',
          firstName: 'Sophie',
          lastName: 'Dupont',
          birthDate: new Date('2020-03-15'),
          age: 4,
          familyId: '1',
        },
        {
          id: 'child-2',
          firstName: 'Lucas',
          lastName: 'Dupont',
          birthDate: new Date('2022-07-22'),
          age: 2,
          familyId: '1',
        },
      ],
      parents: [
        {
          id: 'p1',
          firstName: 'Marie',
          lastName: 'Dupont',
          email: 'marie.dupont@example.fr',
          phoneNumber: '+33 6 12 34 56 78',
          personalSituation: {
            maritalStatus: 'Mariée',
            occupation: 'Ingénieure informatique',
            employer: 'TechCorp France',
            notes: 'Horaires flexibles, télétravail 2 jours par semaine',
          },
          financialInformation: {
            monthlyIncome: 4500,
            employmentType: 'CDI temps plein',
            notes: 'Revenus stables, éligible aux aides',
          },
        },
        {
          id: 'p2',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.fr',
          phoneNumber: '+33 6 98 76 54 32',
          personalSituation: {
            maritalStatus: 'Marié',
            occupation: 'Professeur des écoles',
            employer: 'Éducation Nationale',
            notes: 'Disponible pendant les vacances scolaires',
          },
          financialInformation: {
            monthlyIncome: 3200,
            employmentType: 'Fonctionnaire',
            notes: 'Revenus garantis, avantages sociaux',
          },
        },
      ],
    },
    {
      id: '2',
      familyName: 'Famille Martin',
      guardianNames: ['Claire Martin'],
      address: '45 Avenue des Champs, 69002 Lyon',
      phoneNumber: '+33 4 78 90 12 34',
      email: 'c.martin@example.fr',
      children: [
        {
          id: 'child-3',
          firstName: 'Emma',
          lastName: 'Martin',
          birthDate: new Date('2021-11-08'),
          age: 3,
          familyId: '2',
        },
      ],
      parents: [
        {
          id: 'p3',
          firstName: 'Claire',
          lastName: 'Martin',
          email: 'c.martin@example.fr',
          phoneNumber: '+33 4 78 90 12 34',
          personalSituation: {
            maritalStatus: 'Célibataire',
            occupation: 'Infirmière',
            employer: 'Hôpital de Lyon',
          },
        },
      ],
    },
    {
      id: '3',
      familyName: 'Famille Leroy',
      guardianNames: ['Pierre Leroy', 'Anne Leroy'],
      address: '23 Rue de la République, 33000 Bordeaux',
      phoneNumber: '+33 5 56 78 90 12',
      email: 'leroy.famille@example.fr',
      children: [
        {
          id: 'child-4',
          firstName: 'Noah',
          lastName: 'Leroy',
          birthDate: new Date('2020-09-12'),
          age: 4,
          familyId: '3',
        },
      ],
      parents: [
        {
          id: 'p4',
          firstName: 'Pierre',
          lastName: 'Leroy',
          email: 'pierre.leroy@example.fr',
          phoneNumber: '+33 6 11 22 33 44',
        },
        {
          id: 'p5',
          firstName: 'Anne',
          lastName: 'Leroy',
          email: 'anne.leroy@example.fr',
          phoneNumber: '+33 6 55 66 77 88',
        },
      ],
    },
    {
      id: '4',
      familyName: 'Famille Petit',
      guardianNames: ['Chloé Petit'],
      address: '89 Boulevard Saint-Germain, 75005 Paris',
      phoneNumber: '+33 1 44 55 66 77',
      email: 'chloe.petit@example.fr',
      children: [
        {
          id: 'child-5',
          firstName: 'Chloé',
          lastName: 'Petit',
          birthDate: new Date('2021-05-20'),
          age: 3,
          familyId: '4',
        },
      ],
      parents: [
        {
          id: 'p6',
          firstName: 'Chloé',
          lastName: 'Petit',
          email: 'chloe.petit@example.fr',
          phoneNumber: '+33 1 44 55 66 77',
        },
      ],
    },
    {
      id: '5',
      familyName: 'Famille Moreau',
      guardianNames: ['Louis Moreau', 'Isabelle Moreau'],
      address: '56 Rue du Commerce, 59000 Lille',
      phoneNumber: '+33 3 20 11 22 33',
      email: 'moreau.famille@example.fr',
      children: [
        {
          id: 'child-6',
          firstName: 'Louis',
          lastName: 'Moreau',
          birthDate: new Date('2020-12-03'),
          age: 4,
          familyId: '5',
        },
      ],
      parents: [
        {
          id: 'p7',
          firstName: 'Louis',
          lastName: 'Moreau',
          email: 'louis.moreau@example.fr',
          phoneNumber: '+33 6 77 88 99 00',
        },
        {
          id: 'p8',
          firstName: 'Isabelle',
          lastName: 'Moreau',
          email: 'isabelle.moreau@example.fr',
          phoneNumber: '+33 6 11 22 33 44',
        },
      ],
    },
    {
      id: '6',
      familyName: 'Famille Simon',
      guardianNames: ['Marc Simon', 'Sophie Simon'],
      address: '34 Avenue de la Liberté, 13001 Marseille',
      phoneNumber: '+33 4 91 22 33 44',
      email: 'simon.famille@example.fr',
      children: [
        {
          id: 'child-7',
          firstName: 'Léa',
          lastName: 'Simon',
          birthDate: new Date('2021-02-14'),
          age: 3,
          familyId: '6',
        },
      ],
      parents: [
        {
          id: 'p9',
          firstName: 'Marc',
          lastName: 'Simon',
          email: 'marc.simon@example.fr',
          phoneNumber: '+33 6 99 88 77 66',
        },
        {
          id: 'p10',
          firstName: 'Sophie',
          lastName: 'Simon',
          email: 'sophie.simon@example.fr',
          phoneNumber: '+33 6 55 44 33 22',
        },
      ],
    },
    {
      id: '7',
      familyName: 'Famille Laurent',
      guardianNames: ['Gabriel Laurent', 'Camille Laurent'],
      address: '67 Rue Nationale, 44000 Nantes',
      phoneNumber: '+33 2 40 55 66 77',
      email: 'laurent.famille@example.fr',
      children: [
        {
          id: 'child-8',
          firstName: 'Gabriel',
          lastName: 'Laurent',
          birthDate: new Date('2020-06-25'),
          age: 4,
          familyId: '7',
        },
      ],
      parents: [
        {
          id: 'p11',
          firstName: 'Gabriel',
          lastName: 'Laurent',
          email: 'gabriel.laurent@example.fr',
          phoneNumber: '+33 6 12 34 56 78',
        },
        {
          id: 'p12',
          firstName: 'Camille',
          lastName: 'Laurent',
          email: 'camille.laurent@example.fr',
          phoneNumber: '+33 6 98 76 54 32',
        },
      ],
    },
    {
      id: '8',
      familyName: 'Famille Lefebvre',
      guardianNames: ['Manon Lefebvre'],
      address: '12 Place de la Mairie, 35000 Rennes',
      phoneNumber: '+33 2 99 11 22 33',
      email: 'manon.lefebvre@example.fr',
      children: [
        {
          id: 'child-9',
          firstName: 'Manon',
          lastName: 'Lefebvre',
          birthDate: new Date('2021-08-17'),
          age: 3,
          familyId: '8',
        },
      ],
      parents: [
        {
          id: 'p13',
          firstName: 'Manon',
          lastName: 'Lefebvre',
          email: 'manon.lefebvre@example.fr',
          phoneNumber: '+33 2 99 11 22 33',
        },
      ],
    },
    {
      id: '9',
      familyName: 'Famille Roux',
      guardianNames: ['Hugo Roux', 'Julie Roux'],
      address: '45 Rue Victor Hugo, 67000 Strasbourg',
      phoneNumber: '+33 3 88 44 55 66',
      email: 'roux.famille@example.fr',
      children: [
        {
          id: 'child-10',
          firstName: 'Hugo',
          lastName: 'Roux',
          birthDate: new Date('2020-10-30'),
          age: 4,
          familyId: '9',
        },
      ],
      parents: [
        {
          id: 'p14',
          firstName: 'Hugo',
          lastName: 'Roux',
          email: 'hugo.roux@example.fr',
          phoneNumber: '+33 6 22 33 44 55',
        },
        {
          id: 'p15',
          firstName: 'Julie',
          lastName: 'Roux',
          email: 'julie.roux@example.fr',
          phoneNumber: '+33 6 66 77 88 99',
        },
      ],
    },
    {
      id: '10',
      familyName: 'Famille Fournier',
      guardianNames: ['Jade Fournier', 'Thomas Fournier'],
      address: '78 Avenue Jean Jaurès, 34000 Montpellier',
      phoneNumber: '+33 4 67 88 99 00',
      email: 'fournier.famille@example.fr',
      children: [
        {
          id: 'child-11',
          firstName: 'Jade',
          lastName: 'Fournier',
          birthDate: new Date('2021-01-22'),
          age: 3,
          familyId: '10',
        },
      ],
      parents: [
        {
          id: 'p16',
          firstName: 'Jade',
          lastName: 'Fournier',
          email: 'jade.fournier@example.fr',
          phoneNumber: '+33 6 11 22 33 44',
        },
        {
          id: 'p17',
          firstName: 'Thomas',
          lastName: 'Fournier',
          email: 'thomas.fournier@example.fr',
          phoneNumber: '+33 6 55 66 77 88',
        },
      ],
    },
    {
      id: '11',
      familyName: 'Famille Girard',
      guardianNames: ['Arthur Girard', 'Léonie Girard'],
      address: '23 Rue de la Gare, 21000 Dijon',
      phoneNumber: '+33 3 80 22 33 44',
      email: 'girard.famille@example.fr',
      children: [
        {
          id: 'child-12',
          firstName: 'Arthur',
          lastName: 'Girard',
          birthDate: new Date('2020-04-18'),
          age: 4,
          familyId: '11',
        },
      ],
      parents: [
        {
          id: 'p18',
          firstName: 'Arthur',
          lastName: 'Girard',
          email: 'arthur.girard@example.fr',
          phoneNumber: '+33 6 99 88 77 66',
        },
        {
          id: 'p19',
          firstName: 'Léonie',
          lastName: 'Girard',
          email: 'leonie.girard@example.fr',
          phoneNumber: '+33 6 55 44 33 22',
        },
      ],
    },
  ],
  authorizedPersons: [],
  authorizedPersonChildLinks: [],
};

export function getChildcareMockDatabase(): ChildcareMockDatabase {
  return mockDatabase;
}

export function getAllChildren(): Child[] {
  const allChildren: Child[] = [];
  mockDatabase.families.forEach((family) => {
    if (family.children) {
      allChildren.push(...family.children);
    }
  });
  return allChildren;
}

export function getChildById(childId: string): Child | null {
  for (const family of mockDatabase.families) {
    const child = family.children?.find((c) => c.id === childId);
    if (child) {
      return child;
    }
  }
  return null;
}

export function getFamilyByChildId(childId: string): Family | null {
  return mockDatabase.families.find((f) => f.children?.some((c) => c.id === childId)) || null;
}

export function getFamilyById(familyId: string): Family | null {
  return mockDatabase.families.find((f) => f.id === familyId) || null;
}

export function getAllFamilies(): Family[] {
  return mockDatabase.families;
}

export function addFamily(family: Family): void {
  mockDatabase.families.push(family);
}

export function updateFamilyInDb(updatedFamily: Family): void {
  const index = mockDatabase.families.findIndex((f) => f.id === updatedFamily.id);
  if (index !== -1) {
    mockDatabase.families[index] = updatedFamily;
  }
}

export function getAuthorizedPersons(): AuthorizedPerson[] {
  return mockDatabase.authorizedPersons;
}

export function addAuthorizedPerson(person: AuthorizedPerson): void {
  mockDatabase.authorizedPersons.push(person);
}

export function getAuthorizedPersonChildLinks(): AuthorizedPersonChildLink[] {
  return mockDatabase.authorizedPersonChildLinks;
}

export function addAuthorizedPersonChildLink(link: AuthorizedPersonChildLink): void {
  mockDatabase.authorizedPersonChildLinks.push(link);
}
