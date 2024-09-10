import RunCron from "../../Utils/Cron";
import LIMIT_MAX from "Common/Types/Database/LimitMax";
import OneUptimeDate from "Common/Types/Date";
import { EVERY_MINUTE } from "Common/Utils/CronTime";
import QueryHelper from "Common/Server/Types/Database/QueryHelper";
import ScheduledMaintenance from "Common/Models/DatabaseModels/ScheduledMaintenance";
import ScheduledMaintenanceService from "Common/Server/Services/ScheduledMaintenanceService";
RunCron(
  "ScheduledMaintenance:SendSubscriberRemindersOnEventScheduled",
  { schedule: EVERY_MINUTE, runOnStartup: false },
  async () => {
    // get all scheduled events of all the projects.
    const scheduledEvents: Array<ScheduledMaintenance> =
      await ScheduledMaintenanceService.findBy({
        query: {
          nextSubscriberNotificationBeforeTheEventAt: QueryHelper.lessThan(
            OneUptimeDate.getCurrentDate(),
          ),
          createdAt: QueryHelper.lessThan(OneUptimeDate.getCurrentDate()),
        },
        props: {
          isRoot: true,
        },
        limit: LIMIT_MAX,
        skip: 0,
        select: {
          _id: true,
          title: true,
          description: true,
          startsAt: true,
          monitors: {
            _id: true,
          },
          statusPages: {
            _id: true,
          },
          sendSubscriberNotificationsOnBeforeTheEvent: true,
          nextSubscriberNotificationBeforeTheEventAt: true,
        },
      });

    for (const event of scheduledEvents) {
      const nextSubscriberNotificationAt: Date | null =
        ScheduledMaintenanceService.getNextTimeToNotify({
          eventScheduledDate: event.startsAt!,
          sendSubscriberNotifiationsOn:
            event.sendSubscriberNotificationsOnBeforeTheEvent!,
        });

      await ScheduledMaintenanceService.updateOneById({
        id: event.id!,
        data: {
          nextSubscriberNotificationBeforeTheEventAt:
            nextSubscriberNotificationAt,
        },
        props: {
          isRoot: true,
        },
      });
    }

    await ScheduledMaintenanceService.notififySubscribersOnEventScheduled(
      scheduledEvents,
    );
  },
);
