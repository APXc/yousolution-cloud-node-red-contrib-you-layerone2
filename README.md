# LayerOne2 NodeRed Library 
`Official Library By YouSolution.Cloud`

# What is LayerOne?
LayerOne2 it's a service for comunicaton via Web API on format JSON for SAP ServiceLayer,

Created by InnoTech Srl -Build Partner SAP

[![LogoInnotech](https://innotech.software/wp-content/uploads/2021/01/Logo_Innotech_Positive_RGB-800x166.png)](https://innotech.software/)

# Installation

You can install the nodes using node-red's "Manage palette" in the side bar.

Or run the following command in the root directory of your Node-RED installation

    npm install @yousolution/node-red-contrib-you-layerone2 --save

# Dependencies

The nodes are tested with `Node.js v16.18.6` and `Node-RED v3.0.2`.

- [axios](https://github.com/axios/axios)
- [odata-query](https://github.com/techniq/odata-query)
- [uuid](https://github.com/uuidjs/uuid)

# Changelog

Changes can be followed [here](/CHANGELOG.md).

# Usage

## Basics

### Authenticate (node authenticateSap)

Use this node to authenticate with a valid SAP service layer API access\
The node requires the following credentials:

- host
- port
- protocol
- company
- user
- password

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_

### Retrieve a list of entities (node listSap)

Use this node to retrieve a list of entities

1. Select the type of entity you want to retrieve as a list
2. If you want to add filter/options use oData params _optional_\
   Query options on entities:

| option   | description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| $filter  | Restrict the set of business objects returned.                              |
| $orderby | Specify the order in which business objects are returned from the service.  |
| $select  | Restrict the service to return only the properties requested by the client. |
| $skip    | Specify that the result excludes the first n entities.                      |
| $top     | Specify that only the first n records should be returned.                   |

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_

### Get single entity (node getSap)

Use this node to get a single entity by providing the primary key

1. Select the type of entity you want to retrieve
2. Use _objectId_ as primary key of entity
3. Use _oData_ to filter the response fields _optional_\

Query options on single entity:

| option  | description                                                                 |
| ------- | --------------------------------------------------------------------------- |
| $select | Restrict the service to return only the properties requested by the client. |

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_

### Create a new entity (node createSap)

Use this node to create a new entity.

1. Select the type of entity you want to create
2. Use _msg.bodyPost_ to provide the entity's fields
3. Use _msg.createParams_ to provide object params

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_

### Update an object

Use this node to update an object.

1. Select the type of object you want to update
2. Use _objectId_ as primary key of object
3. Use _msg.updateParams_ to provide object params

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_

### Delete an Object

Use this node to delete an object.

1. Select the type of object you want to delete
2. Use _objectId_ as primary key of object

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_

### Count the number of objects per type

Use this node to count the number of objects per type.

1. Select the type of object you want to count

You can see how to use it in the example flows in the _/examples_ directory.\
_For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)_