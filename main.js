const { render } = ReactDOM;
const { Component } = React;
const { HashRouter, Switch, Link, Route, Redirect } = ReactRouterDOM;
const API = "https://acme-users-api-rev.herokuapp.com/api";

/* components */
const Nav = ({ path, companies }) => {
  return (
    <nav>
      <Link to="/" className={path === "/" ? "selected" : ""}>
        Acme Company Profits with React Router
      </Link>
      <Link to="/companies" className={path === "/companies" ? "selected" : ""}>
        Companies ({companies.length})
      </Link>
    </nav>
  );
};

const Home = () => {
  return <h3>Welcome!!!</h3>;
};

const Companies = ({ companies, path }) => {
  //   console.log({ companies });
  return (
    <div id="companies">
      <ul>
        {companies.map(co => {
          return (
            <li key={co.id}>
              <Link
                to={`/companies/${co.id}`}
                className={path.includes(co.id) ? "selected" : ""}
              >
                {co.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <Route path="/companies/:id?" component={Company} />
    </div>
  );
};

class Company extends Component {
  constructor() {
    super();
    this.state = {
      companyProfits: []
    };
  }

  async loadData(id) {
    const response = (await axios.get(
      `https://acme-users-api-rev.herokuapp.com/api/companies/${id}/companyProfits`
    )).data.map(profit => {
      return {
        id: profit.id,
        fiscalYear: profit.fiscalYear,
        amount: profit.amount
      };
    });
    console.log(response);
    this.setState({ companyProfits: response });
  }

  componentDidUpdate(prevProps) {
    const id = this.props.match.params.id;
    if (prevProps.match.params.id !== id) {
      this.loadData(id);
    }
  }

  componentDidMount() {
    this.loadData(this.props.match.params.id);
  }
  render() {
    const { companyProfits } = this.state;
    return (
      <ul>
        {companyProfits.map(profit => {
          return (
            <li className="profit-list" key={profit.id}>
              <div className="selected">{profit.fiscalYear} </div>
              <div>${profit.amount}</div>
            </li>
          );
        })}
      </ul>
    );
  }
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
    const response = await axios.get(
      "https://acme-users-api-rev.herokuapp.com/api/companies"
    );
    this.setState({ companies: response.data });
  }
  render() {
    const { companies } = this.state;
    return (
      <HashRouter>
        <Route
          render={({ location }) => (
            <Nav path={location.pathname} companies={companies} />
          )}
        />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/companies/:id?"
            render={({ location }) => (
              <Companies path={location.pathname} companies={companies} />
            )}
          />
        </Switch>
      </HashRouter>
    );
  }
}

const root = document.querySelector("#root");
render(<App />, root);
