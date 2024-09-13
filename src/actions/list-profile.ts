import Profile from '../../models/profile';

export default async function () {
    const profiles = await Profile.findAll()
    profiles.forEach(profile => {
        console.log(`[${profile.id}] '${profile.name}' \t| \tFB: ${profile.facebook ? '✅' : '❌'} \t|\t TW: ${profile.instagram ? '✅' : '❌'} \t|\t IG: ${profile.twitter ? '✅' : '❌'}\t`);
    })
}