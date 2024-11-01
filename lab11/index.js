
class Agente {
  constructor(nombre, rol, habilidades, imagen) {
    this.nombre = nombre;
    this.rol = rol;
    this.habilidades = habilidades;
    this.imagen = imagen;
  }
}


async function getAgents() {
  const url = "https://valorant-api.com/v1/agents";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.map(agentData => {
      const habilidades = agentData.abilities.map(habilidad => habilidad.displayName);
      return new Agente(agentData.displayName, agentData.role?.displayName || 'Sin rol', habilidades, agentData.displayIcon);
    });
  } catch (error) {
    console.error("Error al obtener agentes:", error);
  }
}


async function renderAgents() {
  const agentsContainer = document.getElementById("agentsContainer");
  const agents = await getAgents();

  agentsContainer.innerHTML = agents
    .map(agent => {
      return `
        <div class="agent">
          <img src="${agent.imagen}" alt="${agent.nombre}" />
          <h2>${agent.nombre}</h2>
          <p><strong>Rol:</strong> ${agent.rol}</p>
          <ul>
            ${agent.habilidades.map(habilidad => `<li>${habilidad}</li>`).join("")}
          </ul>
        </div>
      `;
    })
    .join("");
}


document.getElementById("searchInput").addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase();
  const agentCards = document.querySelectorAll(".agent");

  agentCards.forEach(card => {
    const agentName = card.querySelector("h2").textContent.toLowerCase();
    card.style.display = agentName.includes(searchTerm) ? "" : "none";
  });
});


renderAgents();

// Función para no tener agentes repetidos
async function getAgents() {
  const url = "https://valorant-api.com/v1/agents";
  try {
    const response = await fetch(url);
    const data = await response.json();

    const uniqueAgents = new Map();
    data.data.forEach(agentData => {
      if (!uniqueAgents.has(agentData.displayName)) {
        const habilidades = agentData.abilities.map(habilidad => habilidad.displayName);
        const agent = new Agente(
          agentData.displayName,
          agentData.role?.displayName || 'Sin rol',
          habilidades,
          agentData.displayIcon
        );
        uniqueAgents.set(agentData.displayName, agent);
      }
    });

    return Array.from(uniqueAgents.values());
  } catch (error) {
    console.error("Error al obtener agentes:", error);
  }
}

