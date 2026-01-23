
(async () => {
    try {
        console.log("🔍 Fetching Demo IDs for Mint...");
        const ids = await (await fetch('http://localhost:3000/api/v1/vcredits/demo/ids')).json();
        console.log("IDs:", ids);

        if (!ids.walletId || !ids.issuerId) throw new Error("Missing IDs for Minting");

        // 1. Get SkyMils Definition
        const defs = await (await fetch('http://localhost:3000/api/v1/vcredits/definitions')).json();
        const skyMileDef = defs.find((d: any) => d.id === 'SKY_MILES_V2' || d.issuerId === ids.issuerId);

        if (!skyMileDef) throw new Error("No Credit Definition found for Mint");
        console.log("✅ Asset to Mint:", skyMileDef.name);

        console.log("\n🔄 Initiating Mint (500 SKY)...");
        const res = await fetch('http://localhost:3000/api/v1/vcredits/mint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                issuerId: ids.issuerId,
                targetWalletId: ids.walletId,
                creditDefId: skyMileDef.id,
                amount: 500,
                reason: "Demo Mint V2 Test"
            })
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Mint Request Failed");

        console.log("✅ Mint Success!", result);

    } catch (e: any) {
        console.error("❌ Mint Test Failed:", e.message);
    }
})();
