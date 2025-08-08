async function PersonalFinancialManagementAccountAggregationWalkthrough(
  workflowCtx,
  portal
) {
  return {
    Guide: {
      name: "Introduction Guide",
      stepCallback: async () => {
        return workflowCtx.showContent(`
## Introduction

This API Recipe demonstrates how to retrieve account information and transaction history using a step-by-step approach.

> **Note:** You’ll need an **Access Token** to proceed. Ensure it is added in the **Authorization** section for each step.

Click **Next** to begin with **Step 1**.

---

## Recipe Steps

### Step 1 – Retrieve Account Information

In this step, you will fetch account details.

- Default parameter values will be used unless you modify them.
- Click **Try it Out** to execute the request and retrieve account information.

---

### Step 2 – Retrieve Transaction History

This step allows you to retrieve the transaction history for the selected account.

- You can use the following **optional parameters**:
  - \`startTime\`
  - \`endTime\`
  - \`offset\`
  - \`limit\`
- Default values will be applied if you choose not to modify the parameters.
- Click **Try it Out** to fetch the transactions data.

Once completed, a **tabular summary** of the transactions will be displayed.

`);

      },
    },
    "Step 1": {
      name: "Retrieve Account Information",
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
            "This endpoint is used to retrieve investments information.",
          endpointPermalink: "$e/Account%20Information/getAccount",
          args: {
            "x-fapi-interaction-id": "c770aef3-6784-41f7-8e0e-ff5f97bddb3a",
            accountId: "accountID0",
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
    "Step 2": {
      name: "Retrieve Transactions History",
      stepCallback: async (stepState) => {
        const step2State = stepState?.["Step 1"];
        console.log("step2State", step2State);
        await portal.setConfig((defaultConfig) => {
          return {
            ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description: "This endpoint is used to retrieve transactions history",
          endpointPermalink: "$e/Account%20Transactions/searchForAccountTransactions",
          args: {
            "x-fapi-interaction-id": "c770aef3-6784-41f7-8e0e-ff5f97bddb3a",  
            accountId: step2State?.data?.accountId,
            startTime: "2021-07-15",
            endTime: "2021-07-15"  
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
    "Account Summary": {
      name: "Finish",
      stepCallback: async (stepState) => {
        setTimeout(() => {
          populateTransactionTable(stepState?.["Step 2"]?.data);
        }, 1000);
        return workflowCtx.showContent(`

<div class="container py-5">
<!-- Header -->
<header class="mb-5">
<h1 class="mb-4">Dashboard</h1>
<p class="text-muted">here are your account details</p>
<hr>
</header>

<!-- Transaction History Section -->
<section>
<div class="d-flex justify-content-between align-items-center mb-4">
<h2 class="h4 mb-0">Recent Transactions</h2>
</div>

<div class="card shadow-sm">
<div class="card-body p-0">
<div class="table-responsive custom-table" data-container="transactions">
<table class="table table-hover mb-0">
<thead class="table-light">
<tr>
<th scope="col">Date</th>
<th scope="col">Description</th>
<th scope="col">Category</th>
<th scope="col" class="text-end">Amount</th>
</tr>
</thead>
<tbody>
<!-- Transaction rows will be populated by JavaScript -->
</tbody>
</table>
</div>
</div>
</div>
</section>
</div>
`);
      },
    },
  };
}

// Function to format date from ISO string to readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

// Function to get icon based on transaction category
function getCategoryIcon(category) {
  const categoryMap = {
    Groceries: "cart",
    "Shopping/Entertainment: General Merchandise": "bag",
    "Fast Food": "cup-hot",
    "Income: Paychecks/Salary": "briefcase",
    Deposit: "download",
    "Phone, Internet/Cable": "wifi",
    "Other Outgoing Transfers": "arrow-up-right",
    "Alcohol, Wine/Bars": "glass-water",
    "Other Miscellaneous": "box",
    "Health: Healthcare/Medical": "activity",
    Services: "tool",
    "Cash, Checks/Misc: ATM/Cash Withdrawals": "cash",
    "Gas/Fuel": "fuel",
    "Life Insurance": "shield",
    "Energy/Gas/Electric": "zap",
    "Mortgage Payments": "home",
    "Online payment service": "credit-card",
  };

  // Extract the main category if it contains a colon
  const mainCategory = category.split(":")[0].trim();

  // Try to match the full category first, then the main category, or default to 'file-text'
  return categoryMap[category] || categoryMap[mainCategory] || "file-text";
}

// Function to populate transaction table
function populateTransactionTable(transactionData) {
  try {
    const transactionContainer = document.querySelector('[data-container="transactions"]');
    if (!transactionContainer) {
      console.error('Transaction container not found. Make sure there is a div with data-container="transactions" attribute.');
      return;
    }

    const transactionTable = transactionContainer.querySelector('table');
    if (!transactionTable) {
      console.error('No table found within the transaction container.');
      return;
    }

    let tableBody = transactionTable.querySelector('tbody');
    if (!tableBody) {
      console.log('No tbody found, creating one');
      tableBody = document.createElement('tbody');
      transactionTable.appendChild(tableBody);
    }

    tableBody.innerHTML = '';

    const sortedTransactions = [...transactionData.transactions || []].sort((a, b) => {
      const dateA = new Date(a?.transactionTimestamp || 0);
      const dateB = new Date(b?.transactionTimestamp || 0);
      return dateB - dateA;
    });

    sortedTransactions.forEach(item => {
      const transaction = item || {};
      const amount = typeof transaction.amount === 'number' ? transaction.amount : 0;
      const subCategory = transaction.subCategory || 'General';
      const description = transaction.description?.trim() || 'No description';
      const timestamp = transaction.transactionTimestamp || new Date().toISOString();
      const date = formatDate(timestamp);
      const icon = getCategoryIcon(subCategory);
      const formattedAmount = amount >= 0 
        ? `+${formatCurrency(amount)}`
        : `-${formatCurrency(Math.abs(amount))}`;
      const transactionClass = amount >= 0 
        ? 'custom-transaction-positive'
        : 'custom-transaction-negative';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${date}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="bg-light rounded-circle p-2 me-3">
              <i class="bi bi-${icon}"></i>
            </div>
            <div>
              <p class="mb-0 fw-medium">${description}</p>
            </div>
          </div>
        </td>
        <td><span class="badge bg-light text-dark">${subCategory}</span></td>
        <td class="text-end ${transactionClass}">${formattedAmount}</td>
      `;

      tableBody.appendChild(row);
    });

    console.log('Transaction table populated successfully with', sortedTransactions.length, 'transactions');
  } catch (error) {
    console.error('Error populating transaction table:', error);
  }
}

