async function NotificationWalkthrough(workflowCtx, portal) {
    return {
      Guide: {
        name: "Introduction",
        stepCallback: async () => {
          return workflowCtx.showContent(`
## Introduction

This API Recipe demonstrates how to create and retrieve a notification subscription. It provides a step-by-step guide to help you set up and manage notifications for various events, ensuring you stay informed about important updates or changes.

> **Note:** You’ll need an **Access Token** to proceed. Make sure it is added in the **Authorization** section for each step.

Click **Next** to begin with **Step 1**.

---

## Recipe Steps

### Step 1 – Create Notification Subscription

In this step, you will create a new notification subscription.

- Default parameter values will be used unless you modify them.
- Click **Try it Out** to create the subscription.

---

### Step 2 – Retrieve Notification Subscription

This step retrieves the notification subscription you created.

- Default parameter values will be used unless you modify them.
- Click **Try it Out** to fetch the subscription details.

Once completed, the subscription details will be displayed for review.

  `);
        },
      },
      "Step 1": {
        name: "Create Notification Subscription",
        stepCallback: async (stepState) => {
          await portal.setConfig((defaultConfig) => {
            return {
              ...defaultConfig,
              config: {
                ...defaultConfig.config,
              },
            };
          });
          return workflowCtx.showEndpoint({
            description:
              "This endpoint is used to create notification subscription entry on the server.",
            endpointPermalink: "$e/Event%20Notifications/createNotificationSubscription",
            args: {
              "x-fapi-interaction-id": "c770aef3-6784-41f7-8e0e-ff5f97bddb3a",
              body: {
                type: "CONSENT_REVOKED",
                category: "CONSENT",
                callbackUrl: "https://abc.com/notification",
                effectiveDate: "2021-11-24",
                subscriptionId : "GUID-SubscriptionId1",
                subscriber: {
                  name: "ABC Inc",
                  type: "DATA_ACCESS_PLATFORM",
                  homeUri: "https://abc.com/logo",
                  logoUri: "https://abc.com/logo",
                  registry: "FDX",
                  registeredEntityName: "ABC",
                  registeredEntityId: "ABC123",
                },
              }  
            },
            verify: (response, setError) => {
              if (response.StatusCode == 200 || response.StatusCode == 404) {
                return true;
              } else {
                setError(
                  "API Call wasn't able to get a valid repsonse. Please try again."
                );
                return false;
              }
            },
          });
        },
      },
      "Step 2": {
      name: "Get Notification Subscription",
      stepCallback: async (stepState) => {
        const step2State = stepState?.["Step 1"];
        console.log("step2State", step2State);
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description: "This endpoint is used to get notification subscription",
          endpointPermalink: "$e/Event%20Notifications/getNotificationSubscription",
          args: {
            "x-fapi-interaction-id": "c770aef3-6784-41f7-8e0e-ff5f97bddb3a",  
            subscriptionId: step2State?.requestData?.args?.body?.subscriptionId,
          },
          verify: (response, setError) => {
            if (response.StatusCode == 200) {
              return true;
            } else {
              setError(
                "API Call wasn't able to get a valid repsonse. Please try again."
              );
              return false;
            }
          },
        });
      },
    },
    };
  }
  

 