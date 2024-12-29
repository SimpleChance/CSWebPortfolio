export class Agent {
    constructor(position, velocity, maxVelocity, maxAcceleration) {
        this.maxVel = maxVelocity;
        this.maxAcc = maxAcceleration;
        this.position = position.clone();
        this.previousPosition = position.clone();
        this.velocity = velocity.clone();
        this.acceleration = new THREE.Vector3();
    }

    applyForce(force) {
        // Limit the magnitude of the applied force to maxAcceleration
        if (force.length() > this.maxAcceleration) {
            force.normalize().multiplyScalar(this.maxAcceleration);
        }
        this.acceleration.add(force);
    }

    update(deltaTime) {
        this.previousPosition.copy(this.position);

        this.velocity.add(this.acceleration);
        // Limit the magnitude of the velocity to maxVelocity
        if (this.velocity.length() > this.maxVelocity) {
            this.velocity.normalize().multiplyScalar(this.maxVelocity);
        }

        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        this.acceleration.set(0, 0, 0); // Reset acceleration
    }

    seek(target) {
        // Calculate desired velocity towards the target
        const desired = target.clone().sub(this.position).normalize().multiplyScalar(this.maxVelocity);

        // Calculate steering force (desired velocity - current velocity)
        const steering = desired.sub(this.velocity);

        // Apply the steering force
        this.applyForce(steering);
    }

    avoid(obstacle, avoidDistance = 1.0) {
        const direction = this.position.clone().sub(obstacle.position);
        const distance = direction.length();

        if (distance < avoidDistance) {
            const avoidForce = direction.normalize().multiplyScalar(this.maxAcceleration * (avoidDistance - distance));
            this.applyForce(avoidForce);
        }
    }
}