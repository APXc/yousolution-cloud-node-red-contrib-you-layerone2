

const { PREFIXNAME, login} = require('../../../utils/reqengine');

module.exports = function(RED) {
    function LayerOne2Auth(config) {
        RED.nodes.createNode(this, config);
        this.layeroneConfigs = config.layerone;
        this.Configs = RED.nodes.getNode(this.layeroneConfigs);
        const node = this;

        node.status({}); // Reset Status
        const globalContext = node.context().global;
        let globalName = `${PREFIXNAME}_${node.id}`;
        globalContext.set(globalName, {
                id: node.id,
                layeroneConfigs: node.layeroneConfigs,
                type: node.entity,
                configs: node.Configs,
                params: []
        });
    
        if (!node.layeroneConfigs) {
            node.status({ fill: 'gray', shape: 'ring', text: 'Missing credentials' });
        }
    
        node.on('input', async function(msg)
        {

            if(config.entity == "Static" || config.entity == "") {
                let currentDate = new Date();
                const headers = globalContext.get(`${globalName}.headers`);
                const exipiredTime = globalContext.get(`${globalName}.exp`);
                let validToken = true;


                msg[PREFIXNAME] = {
                    lyc: node.id,
                    layeroneConfigs: node.layeroneConfigs,
                    type: node.entity
                }

                let conf = RED.nodes.getNode(node.layeroneConfigs).options;
                globalContext.set(`${globalName}.layeroneConfigs`, node.layeroneConfigs); 
                globalContext.set(`${globalName}.configs`, conf);

                if(headers && exipiredTime) {
                    let providedDate = new Date(exipiredTime);
                    let timeDifference = currentDate - providedDate;
                    let minutesDifference = timeDifference / (1000 * 60);
                    validToken = minutesDifference > 25 ? false : true;
                }


                if(!headers || !validToken) {
                    try {
                        const result = await login(node , conf);
                        if(result.data.hasOwnProperty("error")) {
                            node.error( result.data.error , msg);
                            node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
                        }
                        else {
                            globalContext.set(`${globalName}.headers`, { Authorization: `Bearer ${result.data.AuthenticationToken}`});
                            globalContext.set(`${globalName}.dataset`, result.data);
                            globalContext.set(`${globalName}.exp`, currentDate.toISOString());
                            node.send(msg);
                            node.status({ fill: 'green', shape: 'dot', text: 'connected' });
                        }
                    }
                    catch (error) {
                        msg.payload = error;
                        if (error.response && error.response.data) {
                            msg.statusCode = error.response.status;
                            msg.payload = error.response.data.result;
                        }
                        node.error( error , msg);
                        node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
                    }
                }
                else {
                    node.status({ fill: 'green', shape: 'dot', text: 'connected' });
                    node.send(msg);
                }   
            }
            else {

                if(config.entitydynamics == 'Configs'){
                    let currentDate = new Date();
                    const headers = globalContext.get(`${globalName}.headers`);
                    const exipiredTime = globalContext.get(`${globalName}.exp`);
                    let validToken = true;
                    node.layeroneConfigs = msg[config.configsid].config;

                    msg[PREFIXNAME] = {
                        lyc: node.id,
                        layeroneConfigs: msg[config.configsid].config,///node.layeroneConfigs
                        type: node.entity
                    }

                    let conf = RED.nodes.getNode(msg[config.configsid].config).options;
                    globalContext.set(`${globalName}.layeroneConfigs`, msg[config.configsid].config); 
                    globalContext.set(`${globalName}.configs`, conf);

                    if(headers && exipiredTime) {
                        let providedDate = new Date(exipiredTime);
                        let timeDifference = currentDate - providedDate;
                        let minutesDifference = timeDifference / (1000 * 60);
                        validToken = minutesDifference > 25 ? false : true;
                    }

                    if(!headers || !validToken) {
                        try {
                            const result = await login(node , conf);
                            if(result.data.hasOwnProperty("error")) {
                                node.error( result.data.error , msg);
                                node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
                            }
                            else {
                                globalContext.set(`${globalName}.headers`, { Authorization: `Bearer ${result.data.AuthenticationToken}`});
                                globalContext.set(`${globalName}.dataset`, result.data);
                                globalContext.set(`${globalName}.exp`, currentDate.toISOString());
                                node.send(msg);
                                node.status({ fill: 'green', shape: 'dot', text: 'connected' });
                            }
                        }
                        catch (error) {
                            msg.payload = error;
                            if (error.response && error.response.data) {
                                msg.statusCode = error.response.status;
                                msg.payload = error.response.data.result;
                            }
                            node.error( error , msg);
                            node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
                        }
                    }
                    else {
                        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
                        node.send(msg);
                    }   

                }
                else if(config.entitydynamics == 'Params'){
                    let params = msg[config.paramsprops];

                    if(!params) {
                         node.status({ fill: 'red', shape: 'dot', text: 'not set params' });
                        node.error('not set params', msg);
                        return;
                    }


                    let currentDynamics = {};
                    let dynamicsConfigs = globalContext.get(`${globalName}.params`);
                    let exitCurrent = dynamicsConfigs.some((conf) => conf.id == `${params.host}:${params.port}/${params.databaseName}`);

                    if(!exitCurrent) {
                        currentDynamics = {
                            id: `${params.host}:${params.port}/${params.databaseName}`,
                            ...params
                        }
                        dynamicsConfigs.push(currentDynamics);
                        globalContext.set(`${globalName}.params`, dynamicsConfigs);
                        dynamicsConfigs = globalContext.get(`${globalName}.params`);

                    }
                    else {
                        currentDynamics =  dynamicsConfigs.find((conf) => conf.id == `${params.host}:${params.port}/${params.databaseName}`);
                    }


                    let currentDate = new Date();
                    const headers = currentDynamics.headers;///globalContext.get(`${globalName}.headers`);
                    const exipiredTime = currentDynamics.exp;// globalContext.get(`${globalName}.exp`);
                    let validToken = true;

            //     msg.params = {
            //     "host": "localhost",
            //     "port": "5051",
            //     version: "v1",
            //     databaseName: "SBODemo-IT",
            //     companyUser: "manager",
            //     companyPassword: "sapb1",
            //     consumerIdentity:"NTH"
            //   }
                    msg[PREFIXNAME] = {
                        lyc: node.id,
                        layeroneConfigs: config.configsid,///node.layeroneConfigs
                        type: node.entity,
                    }

                    //let conf = RED.nodes.getNode(config.configsid).options;
                    // globalContext.set(`${globalName}.layeroneConfigs`, config.configsid); 
                    // globalContext.set(`${globalName}.configs`, conf);

                    if(headers && exipiredTime) {
                        let providedDate = new Date(exipiredTime);
                        let timeDifference = currentDate - providedDate;
                        let minutesDifference = timeDifference / (1000 * 60);
                        validToken = minutesDifference > 25 ? false : true;
                    }

                    if(!headers || !validToken) {
                        try {
                            

                            const result = await login(node , params);
                            if(result.data.hasOwnProperty("error")) {
                                node.error( result.data.error , msg);
                                node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
                            }
                            else {
                                let index = dynamicsConfigs.findIndex((conf) => conf.id == `${params.host}:${params.port}/${params.databaseName}`);

                                dynamicsConfigs[index].headers = { Authorization: `Bearer ${result.data.AuthenticationToken}`};
                                dynamicsConfigs[index].dataset = result.data;
                                dynamicsConfigs[index].exp = currentDate.toISOString();
                                globalContext.set(`${globalName}.params`, dynamicsConfigs);
                                node.send(msg);
                                node.status({ fill: 'green', shape: 'dot', text: 'connected' });
                            }
                        }
                        catch (error) {
                            msg.payload = error;
                            if (error.response && error.response.data) {
                                msg.statusCode = error.response.status;
                                msg.payload = error.response.data.result;
                            }
                            node.error( error , msg);
                            node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
                        }
                    }
                    else {
                        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
                        node.send(msg);
                    }   
                }
                else {
                    node.status({ fill: 'gray', shape: 'ring', text: 'Missing Dynamics Login' });
                }
            }

           

        }
    )
    }
    RED.nodes.registerType("you-layerone2-auth",LayerOne2Auth);
}