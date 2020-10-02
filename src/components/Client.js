import React, { Component } from 'react';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Form, Row, Col, Button } from "react-bootstrap";

export default class Client extends Component {
  draggableHolderRef = React.createRef();

  componentDidMount() {
    new Draggable(this.draggableHolderRef.current, {
      itemSelector: ".draggable",
    });
  }

  render() {
    return (
      <Row>
        <Col xs={2}>{this.renderSidebar()}</Col>
        <Col xs={10}>
          <FullCalendar
            initialView="timeGridWeek"
            nowIndicator={true}
            allDaySlot={false}
            plugins={[ timeGridPlugin, dayGridPlugin, interactionPlugin ]}
            selectable={true}
            editable={true}
            droppable={true}
            events={this.props.events.map((event) => {
              event.display = "background";
              return event;
            })}
            eventClick={this.props.handleEventClick}
            eventReceive={this.props.handleEventReceive}
            eventOverlap={false}
            headerToolbar={{
              left: "",
              center: "title",
              end: "today prev,next",
            }}
            height="100%"
          />
        </Col>
      </Row>
    );
  }

  renderSidebar = () => {
    return (
      <div className="app-sidebar">
        <div className="app-sidebar-section mt-5">
          <h4>Kisállat</h4>
          <Row>
            <Col className="d-flex f-row">
              <Form.Check
                type="radio"
                label="😺"
                name="animalRadios"
                id="animalRadios1"
                className="ml-auto"
                onChange={() => this.props.handleAnimalChange("cat")}
                checked={this.props.animal === "cat"}
              />
              <Form.Check
                type="radio"
                label="🐶"
                name="animalRadios"
                id="animalRadios2"
                className="ml-auto"
                onChange={() => this.props.handleAnimalChange("dog")}
                checked={this.props.animal === "dog"}
              />
              <Form.Check
                type="radio"
                label="🐰"
                name="animalRadios"
                id="animalRadios3"
                className="ml-auto"
                onChange={() => this.props.handleAnimalChange("rabbit")}
                checked={this.props.animal === "rabbit"}
              />
            </Col>
          </Row>
        </div>
        <div className="app-sidebar-section mt-5">
          <h4>Elérhető kezelések</h4>
          <ul id="draggableHolder" ref={this.draggableHolderRef}>
            {this.props.appointments.map(this.renderSidebarAppointment)}
          </ul>
        </div>
        <div className="app-sidebar-section mt-5">
          Válaszd ki, hogy milyen állatot hozol, majd húzz egy vagy több kezelést a neked is megfelelő szabad idősávra. Ha végeztél, mentsd el!
        </div>
        <div className="app-sidebar-section mt-5">
          <Button
            name="saveAppointmentBtn"
            size="lg"
            variant="success"
            className="btn-block"
            disabled={!this.props.newAppointments.length}
            onClick={() => this.props.handleSaveAppointments()}
          >
            Mentés
          </Button>
        </div>
      </div>
    );
  }

  renderSidebarAppointment = (event) => {
    const id = createEventId();
    let { title, duration } = event;

    let color;
    switch (this.props.animal) {
      case "cat":
        color = "orange";
        break;
      case "dog":
        color = "brown";
        break;
      case "rabbit":
        color = "grey";
        break;
      default:
        color = "blue";
        break;
    }

    let dataEventObj = {
      id: id,
      title: title,
      duration: "00:" + duration,
      color: color
    };

    return (
      <li
        className="draggable border rounded p-1 mb-2 d-flex"
        key={id}
        data-event={JSON.stringify(dataEventObj)}
      >
        <span className="flex-fill">
          <i>{title}</i>
        </span>
        <span className="flex">
          <b>{duration} perc</b>
        </span>
      </li>
    );
  }
}

let eventGuid = 0;
function createEventId() {
  return String(eventGuid++);
}