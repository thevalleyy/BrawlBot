# brawly

## Templates

### config.json

```json
{
    "token": "discord bot token",
    "owner": "discord user id",
    "cooldown_standard": 3,
    "db": {
        "host": "127.0.0.1",
        "port": 3006,
        "user": "db user",
        "password": "db passphrase",
        "database": "db name"
    },
    "channel": {
        "cmd_log": "discord channel id",
        "mod_log": "discord channel id"
    },
    "color": {
        "default": "#36393f",
        "cmd_log": "#36393f",
        "mod_log": "#ffb3ff",
        "error": "#ff0000"
    },
    "keys": {
        "bsapi": "brawlstars api key"
    }
}
```

### database scheme

```
database
├─── profile
└─── settings
```

#### profile table

| #   | primary | name    | data type | default        |
| --- | ------- | ------- | --------- | -------------- |
| 1   | true    | id      | INT       | AUTO_INCREMENT |
| 2   | false   | dcid    | CHAR      | "0"            |
| 3   | false   | regdate | CHAR      | "0"            |
| 4   | false   | bsid    | CHAR      | "0"            |

#### settings table

| #   | primary | name    | data type | default        |
| --- | ------- | ------- | --------- | -------------- |
| 1   | true    | id      | INT       | AUTO_INCREMENT |
| 2   | false   | guildid | INT       | "0"            |
| 3   | false   | lang    | INT       | "0"            |

### data/

```
data/
├─── blacklist.json
├─── brawler.json
└─── maintenance.json
```

#### blacklist.json

```json
[]
```

#### brawler.json

```json
[]
```

#### maintenance.json

```json
{
    "maintenance": false,
    "reason": "⚙ Es finden aktuell Wartungsarbeiten statt."
}
```
