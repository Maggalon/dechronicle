import { useEffect, useMemo, useState, useContext } from "react";
import { DeChronicleContext } from "./context/DeChronicleContext";

import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import { Header } from "./components/Header";
import { NewContribution } from "./components/NewContribution";
import { UserContributions } from "./components/UserContributions";

const App = () => {
  
  const [init, setInit] = useState<boolean>(false);

  const { showProfile } = useContext(DeChronicleContext)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#f72585",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          // onHover: {
          //   enable: true,
          //   mode: "repulse",
          // },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: {
            default: OutMode.out,
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [],
  );


  return (
    <div className="min-h-screen text-white flex flex-col">
      {init && <Particles
                  id="tsparticles"
                  options={options}
                  className="-z-50"
                />}
      <Header />
      { !showProfile ?
        <NewContribution /> :
        <UserContributions />
      }
    </div>
  );
}

export default App;