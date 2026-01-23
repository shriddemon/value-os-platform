(async () => {
    try {
        console.log("🔍 Fetching Demo IDs...");
        const ids = await (await fetch('http://localhost:3000/api/v1/vcredits/demo/ids')).json();
        console.log("IDs:", ids);
        if (!ids.walletId)
            throw new Error("No Wallet ID found");
        console.log("\n🔄 Initiating Swap (100 SKY -> $VAL)...");
        const res = await fetch('http://localhost:3000/api/v1/vcredits/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                walletId: ids.walletId,
                amount: 100,
                fromCreditDefId: 'SKY_MILES_V2'
            })
        });
        const result = await res.json();
        if (!res.ok)
            throw new Error(result.error || "Request Failed");
        console.log("✅ Swap Success!", result);
    }
    catch (e) {
        console.error("❌ Test Failed:", e.message);
    }
})();
//# sourceMappingURL=test_exchange_v2.js.map