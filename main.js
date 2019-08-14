const { render } = ReactDOM
const { Component } = React
const { HashRouter, Switch, Link, Route, Redirect } = ReactRouterDOM
const API = 'https://acme-users-api-rev.herokuapp.com/api'

/* components */
const Nav = ({ path, companies }) => {
    return (
        <nav>
            <Link to='/' className={path === '/' ? 'selected' : ''}>Acme Company Profits with React Router</Link>
            <Link to='/companies' className={path === '/companies' ? 'selected' : ''}>Companies ({companies.length})</Link>
        </nav>
    )
}

const Home = () => {
    return (
        <h3>Welcome!!!</h3>
    )
}

const Companies = ({ companies }) => {
    console.log({ companies })
    return (
        <ul>
            {
                companies.map(co => {
                    return (
                    <li key={co.id}>
                        <Link to={`/companies/${co.id}`}>{co.name}</Link>
                    </li>
                    )
                })
            }
        </ul>
    )
}

const Company = () => {
    return (<div>Company</div>)
}

/* main app */
class App extends Component {
    constructor() {
        super();
        this.state = {
            companies: []
        };
    }
    async componentDidMount() {
        const response = await axios.get('https://acme-users-api-rev.herokuapp.com/api/companies')
        this.setState({ companies: response.data });
    }
    render() {
        const { companies } = this.state;
        return (
            <HashRouter>
                <Route render={({ location }) => <Nav path={location.pathname} companies={companies} />} />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/companies' render={() => <Companies companies={companies} />} />
                </Switch>
            </HashRouter>
        );
    }
}

const root = document.querySelector('#root');
render(<App />, root);