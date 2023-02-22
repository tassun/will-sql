# will-sql

SQL by place holder parameter naming and value setting for execute statement on databases

## Installation

    npm install will-sql

## Examples

### Configuration

This module require configuration([config](https://www.npmjs.com/package/config)) setting by config/default.json under project and [will-util](https://www.npmjs.com/package/will-util)

    npm install config

```json
{
    "MYSQL" : { "alias": "mysql", "dialect": "mysql", "url": "mysql://user:password@localhost:3306/testdb?charset=utf8&connectionLimit=10", "user": "user", "password": "password" },
    "ODBC" : { "alias": "odbc", "dialect": "mysql", "url": "DRIVER={MySQL ODBC 5.3 Unicode Driver};SERVER=localhost;DATABASE=testdb;HOST=localhost;PORT=3306;UID=user;PWD=password;", "user": "user", "password": "password" },
    "MSSQL": { "alias": "mssql", "dialect": "mssql", "url": "Server=localhost,1433;Database=testdb;User Id=user;Password=password;Encrypt=false;Trusted_Connection=Yes;", "user": "user", "password": "password" },
    "ORACLE": { "alias": "oracle", "dialect": "oracle", "url": "localhost:1521/ORCLCDB.localdomain", "user": "user", "password": "password" },
    "POSTGRES": { "alias": "postgres", "dialect": "postgres", "url": "postgresql://user:password@localhost:5432/testdb", "user": "user", "password": "password" },
    "INFORMIX": { "alias": "odbc", "dialect": "informix", "url": "DRIVER={IBM INFORMIX ODBC DRIVER (64-bit)};SERVER=online_localhost;DATABASE=refdb;HOST=localhost;SERVICE=9088;UID=user;PWD=password;CLIENT_LOCALE=th_th.thai620;DB_LOCALE=th_th.thai620;", "user": "user", "password":"password" },
    "SQLITE" : { "alias": "sqlite", "dialect": "sqlite", "url": ":memory:", "user": "", "password": "" },
    "MYSQL2" : { "alias": "mysql2", "dialect": "mysql", "url": "", "user": "user", "password": "password", "host": "localhost", "port": 3306, "database": "testdb", "options": { "charset": "utf8", "connectionLimit": 10 } },
}
```
    npm install will-util

### Queries
Since [mysql](https://www.npmjs.com/package/mysql), [mssql](https://www.npmjs.com/package/mssql), [odbc](https://www.npmjs.com/package/odbc), [oracle](https://www.npmjs.com/package/oracledb), [postgres](https://www.npmjs.com/package/pg) node module using difference place holder for parameter
naming and value setting, like mysql and odbc using ? sign, mssql using @ sign and oracledb using : sign, and postgres using $ sign for naming parameters

#### KnSQL
KnSQL wrap up query statement using only place holder ? sign as parameter naming and value setting

##### java script
```javascript
const connector = require("will-sql");

async function testdb() {
    let knsql = new connector.KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = connector.getDBConnector("MYSQL");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
    db.close();
}
```

##### type script
```typescript
import { KnSQL, DBConnections } from "will-sql";

async function testQuery() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = DBConnections.getDBConnector("MYSQL");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
    db.close();
}
```

### Transaction

```typescript
import { KnSQL, DBConnections } from "will-sql";

async function testTransaction() {
    let knsql = new KnSQL();
    knsql.append("update testdbx set percent = ?percent where mktid = ?mktid ");
    knsql.set("percent",60);
    knsql.set("mktid","TST");
    const db = DBConnections.getDBConnector("MYSQL");
    try {
        await db.beginWork();
        let rs = await knsql.executeUpdate(db);
        console.log("update",rs);
        await db.commitWork();
    } catch(ex) {
        await db.rollbackWork();
    }
    db.close();
}
```

### Database Connector
In order to get database connection `DBConnections.getDBConnector` or `getDBConnector` method can specified by configuration section or configuration setting to establish

#### configuration section

```typescript
    const db = DBConnections.getDBConnector("MYSQL");
```
For example `"MYSQL"` point to section in config/default.json

#### configuration setting

```typescript
    const db = DBConnections.getDBConnector({
        schema: "MYSQL", 
        alias: "mysql", 
        dialect: "mysql", 
        url: "mysql://user:password@localhost:3306/testdb?charset=utf8&connectionLimit=10", 
        user: "user", 
        password: "password"
    });
```
Multiple pool supported by section or `schema` setting so it can defined in difference way 

### Database Adapter
Database adapter now support for `mysql`, `mssql`, `odbc`, `oracle` and `postgres` alias setting. When using database connector instance it can send raw query statement depending on database module

#### mysql

    npm install mysql

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("MYSQL");
    let rs = await db.executeQuery("select * from testdbx where percent > ? ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs",rs);
    db.close();
}
```
#### mysql2

    npm install mysql2

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("MYSQL2");
    let rs = await db.executeQuery("select * from testdbx where percent > ? ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs",rs);
    db.close();
}
```
#### odbc

    npm install odbc

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("ODBC");
    let rs = await db.executeQuery("select * from testdbx where percent > ? ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs2",rs);
    db.close();
}
```
#### mssql

    npm install mssql

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("MSSQL");
    console.log("db",db);
    let rs = await db.executeQuery("select * from testdbx where percentage > @percentage ",{ 
        percentage: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs",rs);
    db.close();
}
```
#### oracledb

    npm install oracledb

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("ORACLE");
    let rs = await db.executeQuery("select * from testdbx where percentage > :percentage ",{ 
        percentage: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs",rs);
    db.close();
}
```
#### postgres

    npm install pg

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("POSTGRES");
    let rs = await db.executeQuery("select * from testdbx where percentage > $1 ",{ 
        percentage: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs",rs);
    db.close();
}
```
#### sqlite

    npm install sqlite3

```typescript
import { DBConnections } from "will-sql";

async function testdb() {
    const db = DBConnections.getDBConnector("SQLITE");

    await db.executeUpdate("create table testdbx(share text, mktid text, yield numeric, percent numeric)");
    await db.executeUpdate("insert into testdbx(share,mktid,yield,percent) values('BBL','TEST',100.50,25.50)");
    await db.executeUpdate("insert into testdbx(share,mktid,yield,percent) values('SCB','TEST',200.50,55.50)");

    let rs = await db.executeQuery("select * from testdbx");
    console.log("rs",rs);

    rs = await db.executeQuery("select * from testdbx where percent > ? ",{ 
        percent: {value: 50, type: "DECIMAL"} 
    });
    console.log("rs2",rs);
    db.close();
}
```

### Connection Pool
Database adapter has connector via connection pool then after used, all connection pools must be closed (or else it do not exit to commamd prompt when running as stand alone application)

```typescript
import { KnSQL, DBConnections } from "will-sql";

async function testQuery() {
    let knsql = new KnSQL();
    knsql.append("select * from testdbx where share = ?share ");
    knsql.set("share","BBL");
    const db = DBConnections.getDBConnector("MYSQL");
    let rs = await knsql.executeQuery(db);
    console.log("rs",rs);
    db.close(); //release connection to pool
    db.end(); //close connection pool
}
```
