/* global $SD */
import React, { useState, useEffect, useReducer } from "react";

import {
  ExampleComponent,
  createUseSDAction,
  SDNumberInput,
  SDTextInput,
  SDSelectInput,
  SDList,
  SDListSelect,
  SDListMultiSelect,
  createUsePluginSettings,
  createUseGlobalSettings
} from "react-streamdeck";

// Slightly modified sdpi.css file. Adds 'data-' prefixes where needed.
import "react-streamdeck/dist/sdpi.css";

import EventList from "./EventList";

export default function App() {
  const createGetSettings = _sd => () => {
    if (_sd.api.getSettings) {
      _sd.api.getSettings(_sd.uuid);
    } else {
      _sd.api.common.getSettings(_sd.uuid);
    }
  };

  const getSettings = createGetSettings($SD);
  useEffect(getSettings, []);

  const useSDAction = createUseSDAction({
    useState,
    useEffect
  });

  const connectedResult = useSDAction("connected");
  const sendToPropertyInspectorResult = useSDAction("sendToPropertyInspector");

  // const globalSettings = useSDAction("didReceiveGlobalSettings");

  const [settings, setSettings] = createUsePluginSettings({
    useState,
    useEffect,
    useReducer
  })(
    {
      buttonState: "",
      textState: "",
      numberState: 0,
      selectState: "",
      selectedListState: []
    },
    connectedResult
  );

  <%% #extraFeatures.obs %%>

  const [obsEvents, setOBSEvents] = useState([]);
  const [obs, setOBS] = useState(null);

  useEffect(() => {
    const obsInstance = new OBSWebSocket();
    obsInstance.connect().then(result => {
      console.log("hack", result);
      setOBS(obsInstance);
    });
  }, []);

  useEffect(() => {
    if (obs) {
      obs.on("SwitchScenes", (err, rawEvent) => {
        console.log({ err, rawEvent });
      });
    } else {
      console.log("OBS as not connected yet");
    }
  }, [obs]);

  const handleClick = event => {
    obs.sendCallback("GetCurrentScene", (err, currentScene) => {
      console.log("OBS:sendCallback", { currentScene, err });
    });
    obs.send("GetCurrentScene").then(currentScene => {
      console.log("OBS:send<promise>", { currentScene });
    });
  };

  <%% /extraFeatures.obs %%>

  console.log({
    connectedResult,
    sendToPropertyInspectorResult,
    settings
  });

  return (
    <div>

      <%% #extraFeatures.obs %%>
      <EventList events={obsEvents} />
      <button onClick={handleClick}>OBS:GetCurrentScene (check logs)</button>
      <%% /extraFeatures.obs %%>

      <ExampleComponent
        text={settings.buttonState}
        onSettingsChange={() => {
          const newState = {
            ...settings,
            buttonState: `testing ${Date.now()}`
          };
          setSettings(newState);
        }}
      />
      <SDTextInput
        value={settings.textState}
        label="Testing"
        onChange={event => {
          const newState = {
            ...settings,
            textState: event.target.value
          };
          setSettings(newState);
        }}
      />
      <SDNumberInput
        value={settings.numberState}
        label="Testing"
        onChange={event => {
          const newState = {
            ...settings,
            numberState: event.target.value
          };
          setSettings(newState);
        }}
      />
      <SDSelectInput
        label="Testing"
        selectedOption={settings.selectState}
        options={[
          {
            label: "test1",
            value: "test1"
          },
          {
            label: "test2",
            value: "test2"
          },
          {
            label: "test3",
            value: "test3"
          }
        ]}
        onChange={event => {
          const newState = {
            ...settings,
            selectState: event
          };
          setSettings(newState);
        }}
      />

      <SDList
        label="Test List"
        options={[
          {
            label: "test1",
            value: "test1"
          },
          {
            label: "test2",
            value: "test2"
          },
          {
            label: "test3",
            value: "test3"
          }
        ]}
      />

      <SDListSelect
        label="Test List"
        selectedOptions={settings.selectedListState}
        options={[
          {
            label: "test1",
            value: "test1"
          },
          {
            label: "test2",
            value: "test2"
          },
          {
            label: "test3",
            value: "test3"
          }
        ]}
        onChange={event => {
          const newState = {
            ...settings,
            selectedListState: event
          };
          setSettings(newState);
        }}
      />

      <SDListMultiSelect
        label="Test List"
        selectedOptions={settings.selectedListState}
        options={[
          {
            label: "test1",
            value: "test1"
          },
          {
            label: "test2",
            value: "test2"
          },
          {
            label: "test3",
            value: "test3"
          }
        ]}
        onChange={event => {
          const newState = {
            ...settings,
            selectedListState: event
          };
          setSettings(newState);
        }}
      />
    </div>
  );
}
