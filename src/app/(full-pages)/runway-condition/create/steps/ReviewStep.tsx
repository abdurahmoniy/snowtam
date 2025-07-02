import { Descriptions, Divider } from "antd";

export default function ReviewStep({ values }: { values: any }) {
    console.log(values)
    return (
        <div className="p-8 bg-white dark:bg-dark-2 rounded shadow grid grid-cols-2 gap-2">
            {/* <div className="">
                <Divider>Review All Entered Data</Divider>
                <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Airport Code">{values.airportCode}</Descriptions.Item>
                    <Descriptions.Item label="Runway Designation">{values.runwayDesignation}</Descriptions.Item>
                    <Descriptions.Item label="Report DateTime">{values.reportDateTime?.toString()}</Descriptions.Item>
                    <Descriptions.Item label="Ambient Temperature">{values.ambientTemperature}</Descriptions.Item>
                    <Descriptions.Item label="Initials">{values.initials}</Descriptions.Item>
                    <Descriptions.Item label="RWYC Code">{values.rwycCode}</Descriptions.Item>
                    <Descriptions.Item label="Overall Condition Code">{values.overallConditionCode}</Descriptions.Item>
                    <Descriptions.Item label="Remarks">{values.remarks}</Descriptions.Item>
                </Descriptions>
            </div> */}
            <div className="">
                <Divider>Runway Thirds</Divider>
                {(values.runwayThirds || []).map((item: any, idx: number) => (
                    <Descriptions key={idx} bordered column={1} size="small" title={`Runway Third #${idx + 1}`}
                        className="mb-4">
                        <Descriptions.Item label="Part Number">{item.partNumber}</Descriptions.Item>
                        <Descriptions.Item label="Coverage">{item.contaminationCoverage}</Descriptions.Item>
                        <Descriptions.Item label="Surface">{item.surfaceCondition}</Descriptions.Item>
                        <Descriptions.Item label="Depth (mm)">{item.depthMm}</Descriptions.Item>
                        <Descriptions.Item label="Friction">{item.frictionCoefficient}</Descriptions.Item>
                        <Descriptions.Item label="RWYC Value">{item.rwycValue}</Descriptions.Item>
                        <Descriptions.Item label="Temp (C)">{item.temperatureCelsius}</Descriptions.Item>
                    </Descriptions>
                ))}
            </div>
            <div className="">
                <Divider>Situational Notifications</Divider>
                {(values.situationalNotifications || []).map((item: any, idx: number) => (
                    <Descriptions key={idx} bordered column={1} size="small" title={`Notification #${idx + 1}`}
                        className="mb-4">
                        <Descriptions.Item label="Type">{item.notificationType}</Descriptions.Item>
                        <Descriptions.Item label="Length Reduction (m)">{item.runwayLengthReductionM}</Descriptions.Item>
                        <Descriptions.Item label="Details">{item.additionalDetails}</Descriptions.Item>
                    </Descriptions>
                ))}
                <Divider>Improvement Procedures</Divider>
                {(values.improvementProcedures || []).map((item: any, idx: number) => (
                    <Descriptions key={idx} bordered column={1} size="small" title={`Procedure #${idx + 1}`}
                        className="mb-4">
                        <Descriptions.Item label="Type">{item.procedureType}</Descriptions.Item>
                        <Descriptions.Item label="Time">{item.applicationTime?.toString()}</Descriptions.Item>
                        <Descriptions.Item label="Effectiveness">{item.effectivenessRating}</Descriptions.Item>
                    </Descriptions>
                ))}
            </div>
        </div>
    );
} 