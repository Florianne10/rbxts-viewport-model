# ViewportModel.ts

`ViewportModel.ts` is a TypeScript version of the EgoMoose module `ViewportModel.lua`. It calculates the camera position to fit a model in the viewport frame.

The original Lua module can be found here: [Github: EgoMoose/ViewportModel.lua](https://gist.github.com/EgoMoose/2fd62ee98754380f6d839267ffe4f588)

You can also find the Roblox Devforum post here: [Devforum: ViewportFrame Model Fitter](https://devforum.roblox.com/t/viewportframe-model-fitter/1345611/)

## Quick Start

### Install

To install the module, you can use npm:

```bash
npm i @rbxts/viewportmodel
```

### Usage

```typescript
// Setup viewport frame and camera
const viewportFrame = PATH_TO_VIEWPORT_FRAME;
const camera = new Instance("Camera");
viewportFrame.CurrentCamera = camera;

const inst = MODEL_TEMPLATE:Clone();
inst.Parent = viewportFrame;

// Setup the ViewportModel
const viewportModel = new ViewportModel(viewportFrame, camera);
viewportModel.setModel(inst);


// Make the camera fit the model with the desired orientation
const angle = CFrame.fromEulerAnglesYXZ(-math.pi * 0.05, -math.pi * 0.2, 0);
const cf = viewportModel.getMinimumFitCFrame(angle);

camera.CFrame = cf;
```

## Documentation

### Constructor

Create a new `ViewportModel` instance using the constructor:

```typescript
new (vpf: ViewportFrame, camera: Camera): ViewportModel;
```

**Parameters:**

- `vpf`: The `ViewportFrame` to use for rendering the model.
- `camera`: The `Camera` to use for rendering the model. This camera should be set to the `ViewportFrame` `CurrentCamera` property.

### Methods

#### setModel

Used to set the model that is being focused on. Should be used for new models and/or a change in the current model.

> e.g. parts added/removed from the model or the model cframe changed

```typescript
setModel(model: Model): void;
```

**Parameters:**

- `model`: The `Model` to set. This should be the model that you want to fit in the viewport frame.

#### calibrate

Should be called when something about the viewport frame / camera changes

> e.g. the frame size or the camera field of view

```typescript
calibrate(): void;
```

#### getFitDistance

Returns a fixed distance that is guaranteed to encapsulate the full model
This is useful for when you want to rotate freely around an object w/o expensive calculations
Focus position can be used to set the origin of where the camera's looking
Otherwise the model's center is assumed

```typescript
getFitDistance(focusPosition?: Vector3): number;
```

**Parameters:**

- `focusPosition`: Optional. The position to focus on. If not provided, the model's center will be used.

#### getMinimumFitCFrame

Returns the optimal camera cframe that would be needed to best fit the model in the viewport frame at the given orientation.
Keep in mind this functions best when the model's point-cloud is correct as such models that rely heavily on meshes, csg, etc will only return an accurate result as their point cloud

```typescript
getMinimumFitCFrame(orientation: CFrame): CFrame;
```

**Parameters:**

- `orientation`: The orientation to use for the camera. This should be a `CFrame` representing the desired orientation of the camera.

## Examples

### Fixed Minimum Distance with rotating camera

The first example is to calculate a fixed minimum distance that’s guaranteed to contain the model regardless of the camera orientation or viewport size.

<video controls src="https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/c/6/a/c6a59ca97bd77cebfd30ace5639911527cb37e04.mp4" title="Title"></video>

```typescript
// Setup viewport frame and camera
const viewportFrame = PATH_TO_VIEWPORT_FRAME;
const camera = new Instance("Camera");
viewportFrame.CurrentCamera = camera;

const inst = MODEL_TEMPLATE:Clone();
inst.Parent = viewportFrame;

// Setup the ViewportModel
const viewportModel = new ViewportModel(viewportFrame, camera);
viewportModel.setModel(inst);



// Make the camera rotating while fitting the model
const distance = viewportModel.getFitDistance();

RunService.RenderStepped:Connect(() => {
    // Update the camera CFrame
    camera.CFrame = cf.mul(CFrame.fromEulerAnglesYXZ(math.rad(-20), math.rad(tick() * 20) % (math.pi * 2), 0).mul(CFrame.new(0, 0, distance)));
});
```

### Minimum Fit in every Orientation while camera is rotating

The second example is to calculate a camera cframe that best fits the model given an orientation. This will mean that the model will always be touching at least one edge of the viewport frame.

However, it’s important to note that this calculation is based off of the model’s point cloud meaning meshes, csg, and/or any other base part that makes it difficult to get a proper point cloud may cause this calculation to seem inaccurate.

<video controls src="https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/f/4/0f4ca95314f0ec89868587ebb94eb7e4914eb131.mp4" title="Title"></video>

```typescript
// Setup viewport frame and camera
const viewportFrame = PATH_TO_VIEWPORT_FRAME;
const camera = new Instance("Camera");
viewportFrame.CurrentCamera = camera;

const inst = MODEL_TEMPLATE:Clone();
inst.Parent = viewportFrame;

// Setup the ViewportModel
const viewportModel = new ViewportModel(viewportFrame, camera);
viewportModel.setModel(inst);



// Make the camera rotating while fitting the model
RunService.RenderStepped:Connect(() => {
    const orientation = CFrame.fromEulerAnglesYXZ(math.rad(-20), math.rad(tick() * 20) % (math.pi * 2), 0);
    const cf = viewportModel.getMinimumFitCFrame(orientation);
    camera.CFrame = cf
});
```
