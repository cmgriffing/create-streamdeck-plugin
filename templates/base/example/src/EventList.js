import React from "react";

export default function EventList(props) {
  const { events } = props;
  return (
    <div className="something">
      {events.map(event => (
        <div>
          {event.type} {event.message}
        </div>
      ))}
    </div>
  );
}
