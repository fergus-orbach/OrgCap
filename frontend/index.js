// set the dimensions and margins of the graph
const data = {
    nodes: {
        teams: [
            {id: "team 1"},
            {id: "team 2"},
            {id: "team 3"},
        ],
        services: [
            {id: "service 1"},
            {id: "service 2"},
            {id: "service 3"},
            {id: "service 4"},
            {id: "service 5"},
            {id: "service 6"},
            {id: "service 7"},
        ]
    },
    links: {
        ownerships: [
            {
                source: "service 1",
                target: "team 1",
            },
            {
                source: "service 2",
                target: "team 2",
            },
            {
                source: "service 7",
                target: "team 2",
            },
            {
                source: "service 3",
                target: "team 1",
            },
            {
                source: "service 6",
                target: "team 1",
            },
            {
                source: "service 4",
                target: "team 3",
            },
            {
                source: "service 5",
                target: "team 3",
            },
        ],
        interactions: [
            {
                source: "service 2",
                target: "service 1",
            },
            {
                source: "service 3",
                target: "service 1",
            },
            {
                source: "service 6",
                target: "service 1",
            },
            {
                source: "service 5",
                target: "service 1",
            },
            {
                source: "service 7",
                target: "service 2",
            },
        ]
    }
}

const colorClasses =
    data.nodes.teams
        .reduce((pv, cv, i) => (
            {
                ...pv,
                [cv.id]: `team-class-${i}`
            }
        ), {})

const fetchOwningTeam = service =>
    data.links.ownerships
        .find(ownership => ownership.source === service)
        .target

const fetchOwningTeam2 = service =>
    data.links.ownerships
        .find(ownership => ownership.source.id === service)
        .target.id

const fetchTeamServices = team =>
    data.links.ownerships
        .filter(ownership => ownership.target.id === team)
        .map(ownership => ownership.source.id)

const fetchDependentNodes = team => {
    const teamServices = fetchTeamServices(team)

    const consumedServices = teamServices
        .flatMap(teamService => data.links.interactions
            .filter(interaction => interaction.target.id === teamService)
            .map(interaction => interaction.source.id)

        )

    const consumingServices = teamServices
        .flatMap(teamService => data.links.interactions
            .filter(interaction => interaction.source.id === teamService)
            .map(interaction => interaction.target.id)
        )

    const dependentTeams = [...new Set([
        ...consumedServices,
        ...consumingServices
    ])].map(service => fetchOwningTeam2(service))

    return {
        teams: new Set([team, ...dependentTeams]),
        services: new Set([...teamServices, ...consumedServices, ...consumingServices]),
    }
}


const makeAllActive = () => {
    document.querySelectorAll('.node').forEach(
        node => {
            node.classList.remove("inactive")
            node.classList.remove("highlighted")
        }
    )
}

const highlightTeamDps = (team) => {
    document.querySelectorAll('.node').forEach(
        node => {
            node.classList.add("inactive")
        }
    )

    const dependentNodes = fetchDependentNodes(team)
    dependentNodes.teams.forEach(team => {
        document.getElementById(`team-${team}`).classList.remove("inactive")
        document.getElementById(`team-${team}`).classList.add("highlighted")
    })

    dependentNodes.services.forEach(service => {
        document.getElementById(`service-${service}`).classList.remove("inactive")
    })
}

const handleMouseOver = (node) => {
    const toolTip = document.createElement('div')
    toolTip.id = "the_tool_tip"
    toolTip.textContent = `${node.id}`
    toolTip.style.top = `${node.y - 10}px`
    toolTip.style.left = `${node.x + 10}px`
    document.getElementById('my_dataviz').appendChild(toolTip)

    highlightTeamDps(node.id)
}

const handleMouseOut = (node) => {
    const toolTip = document.getElementById('the_tool_tip')
    document.getElementById('my_dataviz').removeChild(toolTip)

    makeAllActive()
}


const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const ownerships = svg.selectAll("ownership")
    .data(data.links.ownerships)
    .enter()
    .append("line")
    .attr("stroke", "#aaaaaa")
    .attr("stroke-width", "2")

const interactions = svg.selectAll("interaction")
    .data(data.links.interactions)
    .enter()
    .append("line")
    .attr("stroke", "#aaaaaa")
    .attr("stroke-width", "1")
    .attr("stroke-dasharray", "5,5")

const teams = svg.selectAll("teams")
    .data(data.nodes.teams)
    .enter()
    .append("rect")
    .attr("id", node => `team-${node.id}`)
    .attr("class", node => `node team ${colorClasses[node.id]}`)
    .attr("data-type", "team")
    .attr("data-team", node => node.id)
    .attr("data-grey", "false")
    .on("mouseover", node => handleMouseOver(node))
    .on("mouseout", node => handleMouseOut(node))

const services = svg.selectAll("serviceNodes")
    .data(data.nodes.services)
    .enter()
    .append("circle")
    .attr("id", node => `service-${node.id}`)
    .attr("class", node => `node service ${colorClasses[fetchOwningTeam(node.id)]}`)
    .attr("data-type", "service")
    .attr("data-team", node => fetchOwningTeam(node.id))
    .attr("data-grey", "false")
    .attr("data-service", node => node.id)

const simulation = d3.forceSimulation([...data.nodes.teams, ...data.nodes.services])                    // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
        .links([...data.links.ownerships, ...data.links.interactions])                                      // and this the list of links
        .id(link => link.id)
    )
    .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area

simulation.on("tick", () => {
    ownerships
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y)
    interactions
        .attr("x1", link => link.source.x)
        .attr("y1", link => link.source.y)
        .attr("x2", link => link.target.x)
        .attr("y2", link => link.target.y)
    teams
        .attr("x", node => node.x - 10)
        .attr("y", node => node.y - 10)
    services
        .attr("cx", node => node.x)
        .attr("cy", node => node.y)
});

