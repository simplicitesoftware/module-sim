![](https://www.simplicite.io/resources//logos/logo250.png)
* * *

`SimpliciteInstancesManager` module definition
==============================================

Simplicite Instances Manager (SIM)

Sonarqube analysis: `sonar-scanner -Dsonar.exclusions="**.min.js,**.min.css`

`SIMInstance` business object definition
----------------------------------------

Sandbox

### Fields

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      | 
| ------------------------------------------------------------ | ---------------------------------------- | -------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `simInsSrvId` link to **`SIMServer`**                        | id                                       | yes*     | yes       |          | -                                                                                |
| _Ref. `simInsSrvId.simSrvName`_                              | _regexp(50)_                             |          |           |          | _Server name_                                                                    |
| _Ref. `simInsSrvId.simSrvURL`_                               | _url(100)_                               |          |           | yes      | -                                                                                |
| _Ref. `simInsSrvId.simSrvUsername`_                          | _char(50)_                               |          |           | yes      | _Server user name_                                                               |
| _Ref. `simInsSrvId.simSrvClientCertificate`_                 | _document_                               |          |           | yes      | _Client certificate allowed by server_                                           |
| _Ref. `simInsSrvId.simSrvPassword`_                          | _password(50)_                           |          |           | yes      | _Server password_                                                                |
| `simInsName`                                                 | char(20)                                 | *        | yes       | yes      | -                                                                                |
| `simInsVersion`                                              | enum(7) using `SND_VERSION` list         | yes      | yes       |          | Sandbox version                                                                  |
| `simInsCreated`                                              | date                                     |          |           |          | Sandbox creation date                                                            |
| `simInsUpdated`                                              | datetime                                 |          |           |          | Updated date time                                                                |
| `simInsStatus`                                               | enum(7) using `SND_SND_STATUS` list      |          |           |          | Status                                                                           |
| `simInsURL`                                                  | url(100)                                 |          |           |          | Custom URL                                                                       |
| `simInsProtected`                                            | boolean                                  |          |           |          | Protected?                                                                       |
| `simInsAutoSave`                                             | boolean                                  |          |           |          | Auto save?                                                                       |
| `simInsAutoUpdate`                                           | boolean                                  |          |           |          | Auto update?                                                                     |
| `simInsOwner`                                                | char(100)                                |          |           |          | Owner identifier                                                                 |
| `simInsEmail`                                                | email(100)                               |          |           | yes      | Request email                                                                    |
| `simInsFirstname`                                            | char(100)                                |          |           | yes      | First name                                                                       |
| `simInsLastname`                                             | char(100)                                |          |           | yes      | Last name                                                                        |
| `simInsPhone`                                                | phone(50)                                |          |           | yes      | Phone number                                                                     |
| `simInsCompany`                                              | char(100)                                |          |           | yes      | Company name                                                                     |
| `simInsDescription`                                          | html(4000)                               |          | yes       |          | Sandbox description                                                              |

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

| Name                                                         | Type                                     | Required | Updatable | Personal | Description                                                                      | 
| ------------------------------------------------------------ | ---------------------------------------- | -------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `simSrvName`                                                 | regexp(50)                               | yes*     | yes       |          | Server name                                                                      |
| `simSrvURL`                                                  | url(100)                                 | yes      | yes       | yes      | -                                                                                |
| `simSrvSettings`                                             | text(4000)                               |          | yes       | yes      | Bluemix parameters                                                               |
| `simSrvUsername`                                             | char(50)                                 |          | yes       | yes      | Server user name                                                                 |
| `simSrvPassword`                                             | password(50)                             |          | yes       | yes      | Server password                                                                  |
| `simSrvClientCertificate`                                    | document                                 |          | yes       | yes      | Client certificate allowed by server                                             |
| `simSrvDescription`                                          | html(4000)                               |          | yes       |          | Server description                                                               |

### Custom actions

* `simRefreshAll`: 

