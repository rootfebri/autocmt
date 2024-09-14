import Profile from '../../models/profile.ts';
import chalk from "chalk";

export default async () => {
    const profiles = await Profile.findAll()
    fmtDisplay(profiles)
}

interface FMTProfile {
    name: string;
    facebook: '✅' | '❌';
    instagram: '✅' | '❌';
    twitter: '✅' | '❌';
    fullpath: string;
}

const toTable = (profile: Profile): FMTProfile => {
    return {
        name: chalk.cyan(profile.name),
        facebook: profile.facebook ? '✅' : '❌',
        instagram: profile.instagram ? '✅' : '❌',
        twitter: profile.twitter ? '✅' : '❌',
        fullpath: chalk.yellow(profile.fullpath),
    };
}

const fmtDisplay = (profiles: Profile[]) => {
    console.table(profiles.map(toTable));
}