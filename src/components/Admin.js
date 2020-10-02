import React, { Component } from 'react';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Row, Col } from "react-bootstrap";

export default class Admin extends Component {
  render() {
    return (
      <Row>
          <Col>
            <FullCalendar
              initialView="timeGridWeek"
              navLinks={true}
              nowIndicator={true}
              plugins={[ timeGridPlugin, dayGridPlugin, interactionPlugin ]}
              selectable={true}
              editable={true}
              events={this.props.events.map((event) => {
                event.display = "auto";
                return event;
              })}
              eventClick={this.props.handleEventClick}
              eventDrop={this.props.handleEventDrop}
              eventOverlap={false}
              headerToolbar={{
                left: "dayGridMonth,timeGridWeek,timeGridDay",
                center: "title",
                right: "prev,next today",
                end: "today prev,next", // will normally be on the right. if RTL, will be on the left
              }}
              height="90vh"
            />
          </Col>
        </Row>
    );
  }
}
