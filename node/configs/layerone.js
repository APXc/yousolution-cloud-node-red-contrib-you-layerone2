const { PREFIXNAME } = require('../../utils/reqengine');
module.exports = function (RED)  {
    function LayerOne2ConfigsNode(n) {
        RED.nodes.createNode(this, n);
        this.options = {
            name : n.name || n.id,
            protocol : n.protocol || "",
            host : n.host || "",
            port: n.port, 
            version: n.version,
            databaseName: n.databaseName,
            companyUser: n.companyUser,
            companyPassword: n.companyPassword,
            consumerIdentity: n.consumerIdentity,
        }

        const globalContext = this.context().global;
        let globalName = `${PREFIXNAME}_CONFIG.${n.host.replaceAll('.', '')}_${n.databaseName}_${n.companyUser}`;
        globalContext.set(globalName, {
                id: n.id,
                host: n.host || "",
                databaseName: n.databaseName,
                companyUser: n.companyUser
        });
    }

    RED.nodes.registerType('you-layerone2', LayerOne2ConfigsNode);
}