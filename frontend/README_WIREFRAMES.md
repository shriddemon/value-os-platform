# Value OS - Admin Dashboard Wireframe

## Layout Overview
The dashboard uses a sidebar navigation layout (Shell) with a top header for User Profile/Context.

### Sidebar Navigation
1. **Overview**: High-level metrics (Total Value Locked, Tx Volume).
2. **Issuers**: Manage onboarding of new loyalty programs/issuers.
3. **Merchants**: Global merchant registry.
4. **Operations (Ops)**:
   - **Mint/Burn**: Manual interventions (Admin only).
   - **Transactions**: Global ledger view.
5. **Policy Engine**: Visual rule builder.
6. **Compliance**: Review queue for flagged entities.
7. **Settings**: API Keys, Webhooks, Admin Roles.

---

## Detailed Views

### 1. Overview (Dashboard)
- **Cards Row**: 
    - [Total Token Capitalization ($)]
    - [24h Transaction Count]
    - [Active Issuers]
    - [Pending Compliance Alerts (Red)]
- **Chart**: "Volume by Token Type" (Stacked Bar).
- **Recent Activity Table**:
    - Columns: Timestamp | Token | From | To | Amount | Status | Hash

### 2. Policy Engine (Visual Builder)
- **List View**: Active Policies (e.g., "Non-KYC Limit", "Global Velocity Check").
- **Edit View (Drawer)**:
    - **Rule Name**: Input
    - **Trigger**: "Before Transfer" | "Before Mint"
    - **Conditions** (Logic Builder):
        - `If [Amount] > [10,000]` AND `[User.Level] < [Gold]`
    - **Action**: "Reject" | "Flag for Review" | "Add Fee (10bps)"

### 3. Transaction Details (Drill-down)
*Accessible by clicking any transaction hash.*
- **Header**: Status Badge (Completed/Failed), Timestamp.
- **Flow Diagram**: Visual node graph verifying flow.
    - [Sender Wallet] --(100 pts)--> [Policy Check (Pass)] --(Fee 2 pts)--> [Platform Wallet]
                                             |
                                             --(98 pts)--> [Receiver Wallet]
- **Audit Log**: JSON dump of the Policy Execution Result.
- **Ledger Entries**: The exact double-entry rows created.

### 4. Merchant Terminal View (Partner Portal)
*Different view for Merchant logins*
- Simple "POS" Mode.
- "Scan QR" to accept vCredits.
- "Settle to Fiat" button.
