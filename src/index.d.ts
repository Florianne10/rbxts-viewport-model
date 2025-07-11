/*
MIT License
Copyright (c) 2021 EgoMoose
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

interface ViewportModel {
	/**
	 * Used to set the model that is being focused on
	 * Should be used for new models and/or a change in the current model
	 * e.g. parts added/removed from the model or the model cframe changed
	 * @param model The model to set.
	 */
	setModel(model: Model): void;
	/**
	 * Should be called when something about the viewport frame / camera changes
	 * e.g. the frame size or the camera field of view
	 */
	calibrate(): void;
	/**
	 * Returns a fixed distance that is guaranteed to encapsulate the full model
	 * This is useful for when you want to rotate freely around an object w/o expensive calculations
	 * Focus position can be used to set the origin of where the camera's looking
	 * Otherwise the model's center is assumed
	 * @param focusPosition The position to focus on, defaults to the center of the model.
	 * @return The distance to the model.
	 */
	getFitDistance(focusPosition?: Vector3): number;
	/**
	 * Returns the optimal camera cframe that would be needed to best fit
	 * the model in the viewport frame at the given orientation.
	 * Keep in mind this functions best when the model's point-cloud is correct
	 * As such models that rely heavily on meshes, csg, etc will only return an accurate
	 * result as their point cloud
	 * @param orientation The orientation to apply to the model.
	 * @return The CFrame that best fits the model.
	 */
	getMinimumFitCFrame(orientation: CFrame): CFrame;
}

interface ViewportModelConstructor {
	/**
	 * Creates a new ViewportModel.
	 * @param vpf The ViewportFrame to use.
	 * @param camera The Camera to use for rendering.
	 */
	new (vpf: ViewportFrame, camera: Camera): ViewportModel;
}

declare const ViewportModel: ViewportModelConstructor;
export = ViewportModel;
