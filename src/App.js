import React from "react";
import events from "./events.json";
import appointments from "./appointments.json";
import "./App.css";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Client from "./components/Client";
import Admin from "./components/Admin";

const LOCALSTORAGE_KEY = "appointmentsDemo";

export default class App extends React.Component {
  state = {
    animal: "cat",
    events: [],
    newAppointments: [],
    appointments,
  };

  componentDidMount() {
    this.loadJson();
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <Container fluid>
                <div>
                  <Link to="/admin">🖱 Admin</Link>
                </div>
                <Client
                  animal={this.state.animal}
                  appointments={this.state.appointments}
                  events={this.state.events}
                  newAppointments={this.state.newAppointments}
                  handleAnimalChange={this.handleAnimalChange}
                  handleEventClick={this.handleEventClick}
                  handleEventReceive={this.handleEventReceive}
                  handleSaveAppointments={this.handleSaveAppointments}
                  saveJson={this.saveJson}
                />
              </Container>
            </Route>
            <Route exact path="/admin">
              <Container fluid>
                <div>
                  <Link to="/">🖱 Kliens</Link>
                </div>
                <Admin
                  animal={this.state.animal}
                  appointments={this.state.appointments}
                  events={this.state.events}
                  handleAnimalChange={this.handleAnimalChange}
                  handleEventClick={this.handleEventClick}
                  handleEventReceive={this.handleEventReceive}
                  handleEventDrop={this.handleEventDrop}
                />
              </Container>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

  validateJson(json) {
    let validJson;

    try {
      validJson = JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      throw e;
    }

    return validJson;
  }

  loadJson = () => {
    const ls = window.localStorage.getItem(LOCALSTORAGE_KEY);
    const json = ls || JSON.stringify(events, null, 2);

    this.setState({ events: JSON.parse(json) });

    if (ls === null) {
      this.saveJson(json);
      console.info("LS initialized.");
    }
  };

  saveJson = (json = null) => {
    let { events } = this.state;

    events.forEach((event) => {
      event.display = "auto";
    });

    const validJson = this.validateJson(
      json || JSON.stringify(this.state.events)
    );
    if (!validJson) return;

    window.localStorage.setItem(LOCALSTORAGE_KEY, validJson);
  };

  handleSaveAppointments = () => {
    let { events, newAppointments } = this.state;

    events = events.concat(newAppointments);
    newAppointments = [];

    this.setState({
      events, newAppointments
    })

    this.saveJson(JSON.stringify(events));
  }

  handleAnimalChange = (animal) => {
    this.setState({
      animal
    });
  };

  handleEventClick = (clickInfo) => {
    if (
      window.confirm(
        `Biztos, hogy törölni szeretnéd '${clickInfo.event.title}' eseményt?`
      )
    ) {
      let { events } = this.state;
      let index = -1;

      clickInfo.event.remove();
      events.filter((event, i) => {
        const eventStart = new Date(event.start).getTime();
        const clickEventStart = new Date(clickInfo.event.start).getTime();

        if (eventStart === clickEventStart) {
          index = i;
        }

        return eventStart === clickEventStart;
      });
      
      if (index > -1) {
        let remainingEvents = events.splice(index, events.length);
        remainingEvents.splice(0, 1);

        remainingEvents.forEach((event) => {
          event.id = event.id - 1;
        });

        events = events.concat(remainingEvents);

        this.setState({
          events
        });

        this.saveJson();
      } else {
        let { newAppointments } = this.state;

        newAppointments.filter((event, i) => {
          const eventStart = new Date(event.start).getTime();
          const clickEventStart = new Date(clickInfo.event.start).getTime();
  
          if (eventStart === clickEventStart) {
            index = i;
          }
  
          return eventStart === clickEventStart;
        });

        if (index > -1) {
          let remainingAppointments = newAppointments.splice(index, newAppointments.length);
          remainingAppointments.splice(0, 1);
  
          remainingAppointments.forEach((event) => {
            event.id = event.id - 1;
          });
  
          newAppointments = newAppointments.concat(remainingAppointments);
  
          this.setState({
            newAppointments
          });
        }
      }
    }
  };

  handleEventReceive = (dropInfo) => {
    let { events, newAppointments } = this.state;
    let { event } = dropInfo;

    let appointment = {
      id: events.length,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: event.backgroundColor
    };

    newAppointments.push(appointment);

    this.setState({
      newAppointments
    });
  };

  
  handleEventDrop = (dropInfo) => {
    let { events } = this.state;

    events.filter((event) => {
      const eventStart = new Date(event.start).getTime();
      const oldEventStart = new Date(dropInfo.oldEvent.start).getTime();

      if (eventStart === oldEventStart) {
        event.start = dropInfo.event.start;
        event.end = dropInfo.event.end;
      }

      return eventStart === oldEventStart;
    });
    
    this.setState({
      events
    });

    this.saveJson();
  }
}
