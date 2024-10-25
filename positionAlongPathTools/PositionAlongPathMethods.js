const targetPoints = [0, 0.25, 0.5, 0.75, 1];

export function handleScroll(event, positionAlongPathState) {

	positionAlongPathState.lastScrollTime = performance.now();

	//When a new scroll starts, set the starting distance along the path to whatever the object's current distance is. 
	positionAlongPathState.startingDistance = positionAlongPathState.currentDistanceOnPath;

	const changeInScroll = Math.sign(event.deltaY);
	
	positionAlongPathState.targetDistance += changeInScroll / positionAlongPathState.lengthToScroll / 3; 
}

export function handleScrollTarget(event, positionAlongPathState) {
    positionAlongPathState.lastScrollTime = performance.now();

    // Determine the direction of the scroll
    const changeInScroll = Math.sign(event.deltaY);

    // Find the current index of the target point closest to the current position
    const currentIndex = targetPoints.findIndex(target => positionAlongPathState.currentPercentageOnPath <= target);

    let newIndex = currentIndex;

    if (changeInScroll > 0) {
        // Scroll down: Move to the next target point
        newIndex = currentIndex + 1;

        // If we're past the last point, wrap around to the first
        if (newIndex >= targetPoints.length) {
            newIndex = 0;
        }
    } else if (changeInScroll < 0) {
        // Scroll up: Move to the previous target point
        newIndex = currentIndex - 1;

        // If we're before the first point, wrap around to the last
        if (newIndex < 0) {
            newIndex = targetPoints.length - 1;
        }
    }

    // Set the target distance to the new target point
    positionAlongPathState.targetDistance = targetPoints[newIndex];
    positionAlongPathState.startingDistance = positionAlongPathState.currentPercentageOnPath;
}

export function updatePositionTarget(curvePath, object, positionAlongPathState) {
    let timeElapsed = performance.now() - positionAlongPathState.lastScrollTime;

    if (timeElapsed < positionAlongPathState.movementDuration) {
        // Calculate interpolation factor
        let interpolatedPositionOnPath;
        const timeLeftPercentage = timeElapsed / positionAlongPathState.movementDuration;
        
        const minimumDegreeOfChange = 0.005;
        const maximumDegreeOfChange = 0.9;
        let interpolationFactor = Math.max(timeLeftPercentage, minimumDegreeOfChange);
        interpolationFactor = Math.min(interpolationFactor, maximumDegreeOfChange);

        // Interpolate towards the target position
        interpolatedPositionOnPath = (1 - interpolationFactor) * positionAlongPathState.startingDistance + interpolationFactor * positionAlongPathState.targetDistance;

        // Update state
        positionAlongPathState.currentDistanceOnPath = interpolatedPositionOnPath;
        positionAlongPathState.currentPercentageOnPath = interpolatedPositionOnPath % 1;

        // Ensure valid percentage on path
        if (typeof positionAlongPathState.currentPercentageOnPath === 'undefined') {
            positionAlongPathState.currentPercentageOnPath = 0.001;
        }

        // Position and look at logic
        let lookAtPosition = positionAlongPathState.currentPercentageOnPath - 0.0000001;
        if (typeof lookAtPosition === 'undefined') {
            lookAtPosition = 0.001;
        }
        
        const newPosition = curvePath.curve.getPointAt(positionAlongPathState.currentPercentageOnPath);
        const newLookAt = curvePath.curve.getPointAt(lookAtPosition);
        
        // Apply the new position and look-at point to the object
        object.position.copy(newPosition);
        object.lookAt(newLookAt);
    }
}

export function updatePosition(curvePath, object, positionAlongPathState) {

	let timeElapsed = performance.now() - positionAlongPathState.lastScrollTime;

	if(timeElapsed < positionAlongPathState.movementDuration) {

		let interpolatedPositionOnPath;
	
		// The percentage complete towards the total time to animate, movementDuration.
		const timeLeftPercentage = timeElapsed / positionAlongPathState.movementDuration;
		
		const minimumDegreeOfChange = 0.005;
		const maximumDegreeOfChange = 0.9;

		let interpolationFactor = Math.max(timeLeftPercentage, minimumDegreeOfChange);
		interpolationFactor = Math.min(interpolationFactor, maximumDegreeOfChange);

		interpolatedPositionOnPath = (1 - interpolationFactor) * positionAlongPathState.startingDistance + interpolationFactor * positionAlongPathState.targetDistance;

		positionAlongPathState.currentDistanceOnPath = interpolatedPositionOnPath;
		positionAlongPathState.currentPercentageOnPath = positionAlongPathState.currentDistanceOnPath < 0 ? (1 - (Math.abs(positionAlongPathState.currentDistanceOnPath) % 1)) : positionAlongPathState.currentDistanceOnPath % 1;

		if (typeof positionAlongPathState.currentPercentageOnPath === 'undefined') {
			currentPercentageOnPath = 0.001;
		}
	
		let lookAtPosition = positionAlongPathState.currentPercentageOnPath - 0.0000001;
		if (typeof lookAtPosition === 'undefined') {
			lookAtPosition = 0.001;
		}
	
		const newPosition = curvePath.curve.getPointAt(positionAlongPathState.currentPercentageOnPath);
		const newLookAt = curvePath.curve.getPointAt(lookAtPosition);

		console.log("newPosition ", newPosition)
		
		object.position.copy(newPosition);
		object.lookAt(newLookAt);
	}

}