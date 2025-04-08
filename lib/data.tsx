// Heterosexual: Attraction to individuals of the opposite gender
// Homosexual: Attraction to individuals of the same gender
// Bisexual: Attraction to individuals of both genders
// Pansexual: Attraction to individuals of any gender
// Asexual: Lack of sexual attraction to any gender
// Queer: An umbrella term encompassing non-heterosexual identities

export const allSexualOrientations = () => {
    return {
        heterosexual: "Heterosexual",
        homosexual: "Homosexual",
        bisexual: "Bisexual",
        pansexual: "Pansexual",
        asexual: "Asexual",
        queer: "Queer"
    };
};

export const allGenders = () => {
    return {
        male: "Male",
        female: "Female",
        gay: "Gay",
        lesbian: "Lesbian",
        transMan: "Trans Man",
        transWoman: "Trans Woman"
    };
};
export const allHobbies=()=>{
    return{
        travel:"Travel",
        cooking:"Cooking",
        gaming: "Gaming",
        movies: "Movies",
        photography: "Photography",
        technology: "Technology",
        art: "Art",
        yoga: "Yoga",
        music: "Music",
        fitness: "Fitness",
        fashion: "Fashion",
        hiking: "Hiking",
        pets: "Pets",
        reading: "Reading",
        dancing: "dancing",
    };
};
export const allYearsBorn = () => {
    const currentYear: number = new Date().getFullYear();
    const startYear = currentYear - 50;
    const years: number[] = [];
    for (let i = startYear; i <= currentYear; i++) {
        years.push(i);
    };
    return years;
};


