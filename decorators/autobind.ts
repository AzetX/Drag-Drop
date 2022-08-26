
// autobind decorator
export function Autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
) {
    const initialMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return initialMethod.bind(this);
        }
    }

    return adjustedDescriptor;
}
