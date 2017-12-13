![](https://www.simplicite.io/resources//logos/logo250.png)
* * *

`SimpliciteInstanceManager` module definition
=============================================

Sandboxes manager

`SIMInstance` business object definition
----------------------------------------

Sandbox

### Fields

| Name                                                         | Type                                     | Req | Upd | Description                                                                      | 
| ------------------------------------------------------------ | ---------------------------------------- | --- | --- | -------------------------------------------------------------------------------- |
| `simInsSrvId` link to **`SIMServer`**                        | id                                       | x*  | x   | -                                                                                |
| _Ref. `simInsSrvId.simSrvName`_                              | _regexp(50)_                             |     |     | _Server name_                                                                    |
| _Ref. `simInsSrvId.simSrvURL`_                               | _url(100)_                               |     |     | -                                                                                |
| _Ref. `simInsSrvId.simSrvUsername`_                          | _char(50)_                               |     |     | _Server user name_                                                               |
| _Ref. `simInsSrvId.simSrvClientCertificate`_                 | _document_                               |     |     | _Client certificate allowed by server_                                           |
| _Ref. `simInsSrvId.simSrvPassword`_                          | _password(50)_                           |     |     | _Server password_                                                                |
| `simInsName`                                                 | char(20)                                 | *   | x   | -                                                                                |
| `simInsVersion`                                              | enum(7) using `SND_VERSION` list         | x   | x   | Sandbox version                                                                  |
| `simInsCreated`                                              | date                                     |     |     | Sandbox creation date                                                            |
| `simInsUpdated`                                              | datetime                                 |     |     | Updated date time                                                                |
| `simInsStatus`                                               | enum(7) using `SND_SND_STATUS` list      |     |     | Status                                                                           |
| `simInsURL`                                                  | url(100)                                 |     |     | Custom URL                                                                       |
| `simInsProtected`                                            | boolean                                  |     |     | Protected?                                                                       |
| `simInsAutoSave`                                             | boolean                                  |     |     | Auto save?                                                                       |
| `simInsAutoUpdate`                                           | boolean                                  |     |     | Auto update?                                                                     |
| `simInsOwner`                                                | char(100)                                |     |     | Owner identifier                                                                 |
| `simInsEmail`                                                | email(100)                               |     |     | Request email                                                                    |
| `simInsFirstname`                                            | char(100)                                |     |     | First name                                                                       |
| `simInsLastname`                                             | char(100)                                |     |     | Last name                                                                        |
| `simInsPhone`                                                | phone(50)                                |     |     | Phone number                                                                     |
| `simInsCompany`                                              | char(100)                                |     |     | Company name                                                                     |
| `simInsDescription`                                          | html(4000)                               |     | x   | Sandbox description                                                              |

### Lists

* `SND_VERSION`
    - `3_0` 
    - `3_1` 
    - `3_2` 
    - `4_0` 
* `SND_SND_STATUS`
    - `started` Started
    - `stopped` Stopped
    - `cancelled` Cancelled
    - `processing` Processing

### Custom actions

* `sim01Refresh`: 
* `sim02Health`: 
* `sim03Logs`: 
* `sim04IOCredentials`: 
* `sim10Start`: 
* `sim11Stop`: 
* `sim20Upgrade`: 

`SIMServer` business object definition
--------------------------------------

Sandbox server

### Fields

| Name                                                         | Type                                     | Req | Upd | Description                                                                      | 
| ------------------------------------------------------------ | ---------------------------------------- | --- | --- | -------------------------------------------------------------------------------- |
| `simSrvName`                                                 | regexp(50)                               | x*  | x   | Server name                                                                      |
| `simSrvURL`                                                  | url(100)                                 | x   | x   | -                                                                                |
| `simSrvSettings`                                             | text(4000)                               |     | x   | Bluemix parameters                                                               |
| `simSrvUsername`                                             | char(50)                                 |     | x   | Server user name                                                                 |
| `simSrvPassword`                                             | password(50)                             |     | x   | Server password                                                                  |
| `simSrvClientCertificate`                                    | document                                 |     | x   | Client certificate allowed by server                                             |
| `simSrvDescription`                                          | html(4000)                               |     | x   | Server description                                                               |

### Custom actions

* `simRefreshAll`: 

