import { createContext } from "react"

const appContext = createContext({
  cliContext: '',
  setCliContext: (cli) => {},
	tabContext: '',
	setTabContext: (tab) => {},
	cpaContext: '',
	setCpaContext: (cpa) => {},
	matContext: '',
	setMatContext: (mat) => {},
	repContext: '',
	setRepContext: (rep) => {},
	gerContext: false,
	setGerContext: (ger) => {},
});

export default appContext
