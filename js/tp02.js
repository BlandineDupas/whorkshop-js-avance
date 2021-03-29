let villes = ['nantes', 'paris', 'saint-nazaire', 'angers', 'le mans'];

// forEach()
console.log('----------FOREACH');
villes.forEach(ville => console.log(ville));

// every()
console.log('----------EVERY');
let lettreADansToutesLesVilles = villes.every(ville => ville.includes('a'));
console.log('lettreADansToutesLesVilles', lettreADansToutesLesVilles);

// some()
console.log('----------SOME');
let auMoinsUneVilleAvecUnTiret = villes.some(ville => ville.includes('-'));
console.log('auMoinsUneVilleAvecUnTiret', auMoinsUneVilleAvecUnTiret);


// filter()
console.log('----------FILTER');
let villesSansTiretSansEspace = villes.filter(ville => !ville.includes(' ') && !ville.includes('-'));
console.log('villesSansTiretSansEspace', villesSansTiretSansEspace);

// Chaîner les fonctions
console.log('----------CHAINER LES FONCTIONS');
let villesMajusculeSeTerminantParS = villes.filter(ville => ville.endsWith('s')).map(ville => ville.toUpperCase());
console.log('villesMajusculeSeTerminantParS', villesMajusculeSeTerminantParS);
