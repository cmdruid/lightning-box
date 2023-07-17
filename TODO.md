## Flow

User inputs LNURL and reserves box for 5 minutes.

Server waits for box to confirm final amount.

Server generates static charge (invoice).

Buyer pays static charge.

Server receives callback, then:
  - pays to LNURL (must get confirmation).
  - tells box to unlock.

## Endpoints
  * For Lightning Box
    - GET  session
    - POST session
  * For Zebede
    - Create static charge
    - Delete static charge
    - Pay LNURL
  * For Server
    - Resolve Lightning Address (?)
  * For DB
    - GET  session
    - POST update session
    - GET  clear  session
