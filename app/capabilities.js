export const CAPABILITIES = [
  {
    "type": "lock",
    "attribute": "lock",
    "image": "attribute-icons/lock.png",
    "states": [
      "value"
    ],
    "commands": [
      {
        "command": "lock",
        "capability": "lock",
        "component": "main",
        "arguments": []
      },
      {
        "command": "unlock",
        "capability": "lock",
        "component": "main",
        "arguments": []
      }
    ]
  },
  {
    "type": "switch",
    "attribute": "switch",
    "image": "attribute-icons/switch.png",
    "states": [
      "value"
    ],
    "commands": [
      {
        "command": "on",
        "capability": "switch",
        "component": "main",
        "arguments": []
      },
      {
        "command": "off",
        "capability": "switch",
        "component": "main",
        "arguments": []
      }
    ]
  },
  {
    "type": "switchLevel",
    "attribute": "level",
    "image": "attribute-icons/dimmer.png",
    "states": [
      "value"
    ],
    "commands": [
      {
        "command": "setLevel",
        "capability": "switchLevel",
        "component": "main",
        "arguments": [
          25
        ]
      },
      {
        "command": "setLevel",
        "capability": "switchLevel",
        "component": "main",
        "arguments": [
          50
        ]
      },
      {
        "command": "setLevel",
        "capability": "switchLevel",
        "component": "main",
        "arguments": [
          75
        ]
      },
      {
        "command": "setLevel",
        "capability": "switchLevel",
        "component": "main",
        "arguments": [
          100
        ]
      }
    ]
  },
  {
    "type": "temperatureMeasurement",
    "attribute": "temperature",
    "image": "attribute-icons/temperature.png",
    "states": [
      "value",
      "unit"
    ],
    "commands": []
  },
  {
    "type": "battery",
    "attribute": "battery",
    "image": "attribute-icons/battery.png",
    "states": [
      "value"
    ],
    "commands": []
  }
]