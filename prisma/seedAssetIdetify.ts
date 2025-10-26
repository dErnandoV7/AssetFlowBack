import { prisma } from "../src/config/database"
import { ASSET_IDENTITIES } from "../src/utils/assetIdentifyUtil"

async function main() {
    console.log('Iniciando Asset Identity Seeding...');

    for (const asset of ASSET_IDENTITIES) {
        await prisma.assetIdentity.upsert({
            where: { symbol: asset.symbol },
            update: {},
            create: {
                symbol: asset.symbol,
                canonicalName: asset.canonicalName.toLowerCase(),
            },
        });

    }

    console.log(`Seeding concluído! Foram processados ${ASSET_IDENTITIES.length} ativos.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });